import React, { act } from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../components/register/AddUser";
import axios from "axios";

jest.mock("axios");

// Mock de useRouter para capturar redirecciones
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
      push: mockPush,
    }),
}));


describe("Register Component", () => {
   
    beforeEach(() => {
        jest.clearAllMocks();

        // Simula una respuesta exitosa de la API
        axios.post.mockResolvedValueOnce({ data: { success: true } });
    });

    test("Renders the Register component correctly", () => {
        render(<Register />);
        
        expect(screen.getByText("Create an account")).toBeInTheDocument();
        expect(screen.getByText("Enter your details below to create your account")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Username *")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password *")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Confirm Password *")).toBeInTheDocument();
        expect(screen.getByText("Already have an account? Login here")).toBeInTheDocument();
        expect(screen.getByText("Register")).toBeInTheDocument();
    });

    test("Given valid input, the user can register", async () => {
        render(<Register />);

        const UserTest = {
            username: "testUser",
            password: "testPassword",
            confirmPassword: "testPassword"
        };

        //Get the elements
        const usernameInput = screen.getByPlaceholderText("Username *");
        const passwordInput = screen.getByPlaceholderText("Password *");
        const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password *");
        const registerButtonInput = screen.getByText("Register");

        //Fill in the form
        fireEvent.change(usernameInput, { target: { value: UserTest.username } });
        expect(usernameInput).toHaveValue(UserTest.username);

        fireEvent.change(passwordInput, { target: { value: UserTest.password } });
        expect(passwordInput).toHaveValue(UserTest.password);

        fireEvent.change(confirmPasswordInput, { target: { value: UserTest.confirmPassword } });
        expect(confirmPasswordInput).toHaveValue(UserTest.confirmPassword);

        //Click the register button
        fireEvent.click(registerButtonInput);

        await new Promise(r => setTimeout(r, 500)); // Pequeña espera

        //Expect the login page to be rendered
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith("/login");
        }, { timeout: 5000 }); 
    });

    test("Given an empty username, the error is shown", async () => {
        render(<Register />);

        const UserTest = {
            username: "    ",
            password: "testPassword",
            confirmPassword: "testPassword"
        };

        //Get the elements
        const usernameInput = screen.getByPlaceholderText("Username *");
        const passwordInput = screen.getByPlaceholderText("Password *");
        const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password *");
        const registerButtonInput = screen.getByText("Register");

        //Fill in the form
        fireEvent.change(usernameInput, { target: { value: UserTest.username } });
        fireEvent.change(passwordInput, { target: { value: UserTest.password } });
        fireEvent.change(confirmPasswordInput, { target: { value: UserTest.confirmPassword } });

        //Click the register button
        fireEvent.click(registerButtonInput);

        
        await waitFor(() => {
            expect(screen.getByText("Username is required")).toBeInTheDocument();
        }, { timeout: 2000 });
        
    });

    test("Given a username with blanks, the error is shown", async () => {
        render(<Register />);

        const UserTest = {
            username: "ca ca",
            password: "testPassword",
            confirmPassword: "testPassword"
        };

        //Get the elements
        const usernameInput = screen.getByPlaceholderText("Username *");
        const passwordInput = screen.getByPlaceholderText("Password *");
        const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password *");
        const registerButtonInput = screen.getByText("Register");

        //Fill in the form
        fireEvent.change(usernameInput, { target: { value: UserTest.username } });
        fireEvent.change(passwordInput, { target: { value: UserTest.password } });
        fireEvent.change(confirmPasswordInput, { target: { value: UserTest.confirmPassword } });

        //Click the register button
        fireEvent.click(registerButtonInput);

        
        await waitFor(() => {
            expect(screen.getByText("Username cannot contain white spaces")).toBeInTheDocument();
        }, { timeout: 2000 });
        
    });

    test("Given a short username with blanks, the error is shown", async () => {
        render(<Register />);

        const UserTest = {
            username: "    c    ",
            password: "testPassword",
            confirmPassword: "testPassword"
        };

        //Get the elements
        const usernameInput = screen.getByPlaceholderText("Username *");
        const passwordInput = screen.getByPlaceholderText("Password *");
        const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password *");
        const registerButtonInput = screen.getByText("Register");

        //Fill in the form
        fireEvent.change(usernameInput, { target: { value: UserTest.username } });
        fireEvent.change(passwordInput, { target: { value: UserTest.password } });
        fireEvent.change(confirmPasswordInput, { target: { value: UserTest.confirmPassword } });

        //Click the register button
        fireEvent.click(registerButtonInput);

        
        await waitFor(() => {
            expect(screen.getByText("Username must be at least 3 characters")).toBeInTheDocument();
        }, { timeout: 2000 });
        
    });

    test("Given a blank password, the user is not registered", async () => {
        render(<Register />);

        const UserTest = {
            username: "testUser",
            confirmPassword: "testPassword"
        };

        //Get the elements
        const usernameInput = screen.getByPlaceholderText("Username *");
        const passwordInput = screen.getByPlaceholderText("Password *");
        const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password *");
        const registerButtonInput = screen.getByText("Register");

        //Fill in the form
        fireEvent.change(usernameInput, { target: { value: UserTest.username } });
        fireEvent.change(confirmPasswordInput, { target: { value: UserTest.confirmPassword } });

        //Click the register button
        fireEvent.click(registerButtonInput);

        expect(screen.getByText("Create an account")).toBeInTheDocument();
        expect(screen.getByText("Enter your details below to create your account")).toBeInTheDocument();
    });

    test("Given a short password, the error is shown", async () => {
        render(<Register />);

        const UserTest = {
            username: "testUser",
            password: "a",
            confirmPassword: "testPassword"
        };

        //Get the elements
        const usernameInput = screen.getByPlaceholderText("Username *");
        const passwordInput = screen.getByPlaceholderText("Password *");
        const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password *");
        const registerButtonInput = screen.getByText("Register");

        //Fill in the form
        fireEvent.change(usernameInput, { target: { value: UserTest.username } });
        fireEvent.change(passwordInput, { target: { value: UserTest.password } });
        fireEvent.change(confirmPasswordInput, { target: { value: UserTest.confirmPassword } });

        //Click the register button
        fireEvent.click(registerButtonInput);

        
        await waitFor(() => {
            expect(screen.getByText("Password must be at least 6 characters")).toBeInTheDocument();
        }, { timeout: 2000 });
        
    });

    test("Given an empty confirmation password, the user is not registered", async () => {
        render(<Register />);

        const UserTest = {
            username: "testUser",
            password: "testPassword",
        };

        //Get the elements
        const usernameInput = screen.getByPlaceholderText("Username *");
        const passwordInput = screen.getByPlaceholderText("Password *");
        const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password *");
        const registerButtonInput = screen.getByText("Register");

        //Fill in the form
        fireEvent.change(usernameInput, { target: { value: UserTest.username } });
        fireEvent.change(passwordInput, { target: { value: UserTest.password } });

        //Click the register button
        fireEvent.click(registerButtonInput);

        
        expect(screen.getByText("Create an account")).toBeInTheDocument();
        expect(screen.getByText("Enter your details below to create your account")).toBeInTheDocument();
        
    });

    test("Given different passwords, the error is shown", async () => {
        render(<Register />);

        const UserTest = {
            username: "testUser",
            password: "testPassword",
            confirmPassword: "differentPassword"
        };

        //Get the elements
        const usernameInput = screen.getByPlaceholderText("Username *");
        const passwordInput = screen.getByPlaceholderText("Password *");
        const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password *");
        const registerButtonInput = screen.getByText("Register");

        //Fill in the form
        fireEvent.change(usernameInput, { target: { value: UserTest.username } });
        fireEvent.change(passwordInput, { target: { value: UserTest.password } });
        fireEvent.change(confirmPasswordInput, { target: { value: UserTest.confirmPassword } });

        //Click the register button
        fireEvent.click(registerButtonInput);

        
        await waitFor(() => {
            expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
        }, { timeout: 2000 });
    });

});
