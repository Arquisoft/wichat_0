import React from 'react';
import LogInOrUpPage from "./windows/LogInOrUpPage";
import IndexPage from './windows/IndexPage';
import HomePage from './windows/HomePage';
import {CssBaseline, ThemeProvider, createTheme} from '@mui/material/';
import {BrowserRouter as Router,Route,Routes, Navigate} from 'react-router-dom';

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        light: 'rgb(216, 218, 211)',
        main: 'rgb(74, 74, 72)',
      },
      secondary: {
        light: 'rgb(241, 242, 235)',
        main: 'rgb(164, 194, 165)',
        dark: 'rgb(86, 98, 70)'
      }
    }
  });
  const loggedInRoutes = ({ children }) => {
    const token = localStorage.getItem("sessionToken");
    if (!token) {
      return <Navigate to="/auth/true" />;//redirect to login page
    }
    return children;
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline/>
        <Routes>
          <Route path='/' element={<IndexPage></IndexPage>} />
          <Route path="/auth/:loginRequested" element={<LogInOrUpPage></LogInOrUpPage>}/>
          <Route path="/auth" element={<LogInOrUpPage></LogInOrUpPage>}/>
          <Route path="/home" element={<loggedInRoutes><HomePage/></loggedInRoutes>}/>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
