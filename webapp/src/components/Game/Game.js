/*LA MAYOR PARTE DE ESTE CÓDIGO SE HA SACADO DEL SIGUIENTE ENLACE:
https://github.com/Arquisoft/wiq_es05a/blob/master/webapp/src/components/Pages/Juego.js
CRÉDITOS AL EQUIPO DE DESARROLLO DE WIQ_ES05A
SUS MIEMBROS SE PUEDEN ENCONTRAR EN EL SIGUIENTE ENLACE:
https://github.com/Arquisoft/wiq_es05a/blob/master/README.md
*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container } from '@mui/material';
import PropTypes from 'prop-types'
import Temporizador from '../Temporizador/Temporizador';
import { useNavigate } from 'react-router-dom';

const Juego = () => {

    const navigate = useNavigate();

    //La pregunta (string)
    const [pregunta, setPregunta] = useState("")
    //La Respuesta correcta (string)
    const [resCorr, setResCorr] = useState("")
    //Array de las cuatros respuestas
    const [resFalse, setResFalse] = useState([])
    //Constante que se usa para almacenar la URL de la imagen de la pregunta
    const [imagenPregunta, setImagenPregunta] = useState("");
    //Para saber si el temporizador se ha parado al haber respondido una respuesta
    const [pausarTemporizador, setPausarTemporizador] = useState(false)
    const [restartTemporizador, setRestartTemporizador] = useState(false)
    const [firstRender, setFirstRender] = useState(false);
    const[ready, setReady] = useState(false)
    const [numPreguntaActual, setNumPreguntaActual] = useState(0)
    const [arPreg] = useState([])
    const [numRespuestasCorrectas, setNumRespuestasCorrectas] = useState(0)
    const [numRespuestasIncorrectas, setNumRespuestasIncorrectas] = useState(0)
    const [numPreguntas, setNumPreguntas] = useState(0)

    //const navigate= useNavigate()
  
    //Variables para la obtencion y modificacion de estadisticas del usuario y de preguntas
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
  
    //Primer render para un comportamiento diferente
    useEffect(() => {
      if (!firstRender) {
        setFirstRender(true);
        crearPreguntas(2);
      }
    },[])
  
    //Función que genera un numero de preguntas determinado
    async function crearPreguntas(numPreguntas){
      setPausarTemporizador(true)
      setNumPreguntas(numPreguntas)
      while(numPreguntas>0){
        try {
          const response = await axios.post(`${apiEndpoint}/questions`);

          const respuestas = [...response.data.wrongAnswers, response.data.answer];

          arPreg.push(
            { id: numPreguntas, 
                pregunta: response.data.question,
                resCorr: response.data.answer,
                resFalse: respuestas,
                imagen: response.data.image}
          )
        }
        catch (error) {
          console.error('Error al crear las preguntas:', error);
          // Manejar el error de acuerdo a tus necesidades
        }
        numPreguntas--;
      }
      setReady(true)
      setPausarTemporizador(false)
      updateGame();
      setNumPreguntaActual(numPreguntaActual+1);
    }
  
    //Función que actualiza la pregunta que se muestra en pantalla
    async function updateGame(){
      setPregunta(arPreg[numPreguntaActual].pregunta)
      setResCorr(arPreg[numPreguntaActual].resCorr)
      setResFalse(arPreg[numPreguntaActual].resFalse)
      setImagenPregunta(arPreg[numPreguntaActual].imagen);
      //Poner temporizador a 20 de nuevo
      setRestartTemporizador(true);
    }
  
    /**
     * Funcion que se llamara al hacer click a una de las respuestas
     */
    const botonRespuesta = (respuesta) => { 
      //Comprueba si la respuesta es correcta o no y pone la variable victoria a true o false
      //por ahora esta variable no se utiliza para nada
      setPausarTemporizador(true);
      if(respuesta === resCorr){
        //Aumenta en 1 en las estadisticas de juegos ganado
        setNumRespuestasCorrectas(numRespuestasCorrectas+1);
      }
      else{
        setNumRespuestasIncorrectas(numRespuestasIncorrectas + 1);
      }
      cambiarColorBotones(respuesta, true);
    };
  
    /*
    * Para cambiar el color de los botones al hacer click en uno de ellos
    * True para modo pulsar uno de ellos (acertar/fallar)
    * False si se quiere mostrar color de todos (acabar el tiempo)
    */
    const cambiarColorBotones = (respuesta, bool) => { 
        //Obtenemos el contenedor de botones
        const buttonContainer = document.querySelector('.button-container');
        //Obtenemos los botones dentro del dicho contenedor
        const buttons = buttonContainer.querySelectorAll('.button');
        //Recorremos cada boton
        buttons.forEach((button) => {
          //Desactivamos TODOS los botones
          button.disabled=true; 
          //Ponemos el boton de la respuesta correcta en verde
          if(button.textContent.trim() === resCorr) {
            button.style.backgroundColor = "#05B92B";
            button.style.border = "6px solid #05B92B";
          }
          if(bool){
          //Ponemos el boton de la marcada en rojo si era incorrecta
            cambiarColorUno(respuesta, button);
          }else {
            setNumRespuestasIncorrectas(numRespuestasIncorrectas + 1);
            cambiarColorTodos(button);
          }return button; //esta linea evita un warning de sonar cloud, sin uso
        });
  
    }
  
    //Función que cambia el color de un solo boton (acierto)
    function cambiarColorUno(respuesta, button){
      if(button.textContent.trim()!==respuesta.trim()){
        if((button.textContent.trim() !== resCorr)) {
          button.style.backgroundColor = "#E14E4E";
          button.style.border = "6px solid #E14E4E";
        }
      }
    }
  
    //Funcion que cambia el color de todos los botones (fallo)
    function cambiarColorTodos(button){
      if(button.textContent.trim() === resCorr) {
        button.style.backgroundColor = "#05B92B";
        button.style.border = "6px solid #05B92B";
      } else{
        button.style.backgroundColor = "#E14E4E";
            button.style.border = "6px solid #E14E4E";
      }
    } 
  
    //Función que devuelve el color original a los botones (siguiente)
    async function descolorearTodos(){
      const buttonContainer = document.querySelector('.button-container');
      const buttons = buttonContainer.querySelectorAll('.button');
      buttons.forEach((button) => {
        //Desactivamos TODOS los botones
        button.disabled=false; 
        //Ponemos el boton de la respuesta correcta en verde
          button.style.backgroundColor = "#FFFFFF";
        })
      buttonContainer.querySelector('#boton1').style.border = "6px solid #E14E4E";
      buttonContainer.querySelector('#boton2').style.border = "6px solid #CBBA2A";
      buttonContainer.querySelector('#boton3').style.border = "6px solid #05B92B";
      buttonContainer.querySelector('#boton4').style.border = "6px solid #1948D9";
    } 
  
    // //Primer render para un comportamiento diferente
    // useEffect(() => {
    //   
    // }, [finishGame])
   
    //Funcion que se llama al hacer click en el boton Siguiente
    const clickSiguiente = () => {
      if(numPreguntaActual===numPreguntas){
        navigate('/points', {
          state: { 
            numRespuestasCorrectas: numRespuestasCorrectas,
            numPreguntas: numPreguntas
          }
        });
        
        return
      }
      descolorearTodos()
      setNumPreguntaActual(numPreguntaActual+1)
      updateGame();
      //Recargar a 20 el temporizador
      setRestartTemporizador(true);
      setPausarTemporizador(false);
    }
  
    const handleRestart = () => {
      setRestartTemporizador(false); // Cambia el estado de restart a false, se llama aqui desde Temporizador.js
    };
    
    return (
        <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
          {ready ? <>
            <div className="numPregunta"> <p> {numPreguntaActual} / {numPreguntas} </p> </div>
            <Temporizador id="temp" restart={restartTemporizador} tiempoInicial={20} tiempoAcabado={cambiarColorBotones} pausa={pausarTemporizador} handleRestart={handleRestart}/>
            <h2> {pregunta} </h2>
            {imagenPregunta && (
                <img src={imagenPregunta} alt="Imagen de la pregunta"/>
            )}
            <button 
              onClick={() => console.log("Generar pista...")} //Esto luego generará la pista con el llm por ahora solo genera un log de consola simple
              className="button"
              style={{ marginBottom: '10px' }}
            >
            PISTA
            </button>
            <div className="button-container">
                {resFalse.map((respuesta, index) => (
                    <button key={index} id={`boton${index + 1}`} className="button" onClick={() => botonRespuesta(respuesta)}>{respuesta}</button>
                ))}
            </div>
            <button id="botonSiguiente" className="button" onClick={() =>clickSiguiente()} > SIGUIENTE</button>
            </>
          : <h2> CARGANDO... </h2>}
        </Container>
    );
  };
  
  Juego.propTypes = {
    isLogged: PropTypes.bool,
    username: PropTypes.string,
    numPreguntas: PropTypes.number,
  }
  
  
  export default Juego;