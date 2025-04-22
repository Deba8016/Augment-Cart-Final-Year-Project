import React, { useState, useRef } from 'react';
import {
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Button,
    FormControl,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Text,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { loginUser } from '../../api/User_API'; // Replace with your login API
import Notiflix from 'notiflix';

const Login = ({ isOpen, onClose, switchToSignup }) => {

    const [user, setUser] = useState({
        username: '',
        password: '',
    });
    const [inputUsername, setInputUsername] = useState('');
    const [inputPassword, setInputPassword] = useState('');

    const handleUsername = (e) => {
        const usernameCheck = e.target.value.replace(/[^a-zA-Z0-9@._-]/g, '');
        setInputUsername(usernameCheck);
        setUser({ ...user, username: usernameCheck });
    };

    const handlePassword = (e) => {
        const passwordCheck = e.target.value.replace(/[^a-zA-Z0-9!@#$%^&*()_+{}[\]:;"'<>,.?/-]/g, '');
        setInputPassword(passwordCheck);
        setUser({ ...user, password: passwordCheck });
    };

    const isErrorUsername = inputUsername === '';
    const isErrorPassword = inputPassword === '';

    const usernameValid = useRef(null);
    const passwordValid = useRef(null);

    const submitData = async (e) => {
        e.preventDefault();

        if (!user.username) {
            Notiflix.Notify.failure('Please Enter Your Email Address or Phone Number!');
            usernameValid.current.focus();
        } else if (!user.password) {
            Notiflix.Notify.failure('Please Enter Your Password!');
            passwordValid.current.focus();
        } else if (user.password.length < 6) {
            Notiflix.Notify.failure('Password must be at least 6 characters long!');
            passwordValid.current.focus();
        } else {
            try {
                const res = await loginUser({ username: user.username, password: user.password });
                console.log("LOGIN", res)
                if (res.status === 200) {
                    localStorage.setItem('token', res.data.token);

                    Notiflix.Notify.success('Successfully Logged In ! Redirecting to Home...')
                    onClose(); // Redirect to home or dashboard
                    setTimeout(() => {
                        window.location.replace("/home");
                      }, 1000);

                } else if (res.status === 401) {
                    Notiflix.Notify.warning('Wrong Password. Try Again!');
                } else {
                    Notiflix.Notify.warning('User Does Not Exist. Please check username');
                }
            } catch (error) {
                Notiflix.Notify.failure('Something went wrong. Please try again.');
                console.log(error);
            }
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Login</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={submitData}>
                            <div className="row">
                                <div className="col-md-12">
                                    <FormControl isInvalid={isErrorUsername}>
                                        <FormLabel>Username</FormLabel>
                                        <Input
                                            type="text"
                                            name="username"
                                            value={inputUsername}
                                            ref={usernameValid}
                                            onChange={handleUsername}
                                            placeholder="Enter Your Email or Phone Number"
                                        />
                                        {isErrorUsername ? <FormErrorMessage>Username is required.</FormErrorMessage> : <FormHelperText>Looks good!</FormHelperText>}
                                    </FormControl>
                                    <FormControl isInvalid={isErrorPassword || inputPassword.length < 6} mt={4}>
                                        <FormLabel>Password</FormLabel>
                                        <Input
                                            type="password"
                                            name="password"
                                            value={inputPassword}
                                            ref={passwordValid}
                                            onChange={handlePassword}
                                            placeholder="Enter Your Password"
                                        />
                                        {isErrorPassword || inputPassword.length < 6
                                            ? <FormErrorMessage>Password is required or must be at least 6 characters long.</FormErrorMessage>
                                            : <FormHelperText>Looks good!</FormHelperText>}
                                    </FormControl>
                                </div>
                            </div>

                            <ModalFooter mt={6} justifyContent="space-between">
                                <Text fontSize="sm" align="center" paddingTop="15px">
                                    Don't have an account?{' '}
                                    <Link onClick={switchToSignup} style={{ color: "#4caf50", textDecoration: "underline" }}>Sign Up</Link>
                                </Text>
                                <Button type="submit" style={{ backgroundColor: "#4caf50", color: "white" }} ml={4}>Login</Button>
                            </ModalFooter>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Login;
