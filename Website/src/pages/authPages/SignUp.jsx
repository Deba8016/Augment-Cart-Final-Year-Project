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
    Flex,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { addUser } from '../../api/User_API';
import Notiflix from 'notiflix';

const SignUp = ({ isOpen, onClose, switchToLogin }) => {

    const [user, setUser] = useState({
        name: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [input, setInput] = useState('');
    const [inputMobile, setInputMobile] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [inputConfirmPassword, setInputConfirmPassword] = useState('');

    const handleInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
        setInput(e.target.value);
    };

    const handleMobile = (e) => {
        const onlyNums = e.target.value.replace(/[^0-9]/g, '');
        setUser({ ...user, [e.target.name]: onlyNums });
        setInputMobile(onlyNums);
    };

    const handleEmail = (e) => {
        const emailCheck = e.target.value.replace(/[^a-zA-Z0-9@._-]/g, '');
        setUser({ ...user, [e.target.name]: emailCheck });
        setInputEmail(emailCheck);
    };

    const handlePassword = (e) => {
        const passwordCheck = e.target.value.replace(/[^a-zA-Z0-9!@#$%^&*()_+{}[\]:;"'<>,.?/-]/g, '');
        setUser({ ...user, [e.target.name]: passwordCheck });
        setInputPassword(passwordCheck);
    };

    const handleConfirmPassword = (e) => {
        const confirmPasswordCheck = e.target.value.replace(/[^a-zA-Z0-9!@#$%^&*()_+{}[\]:;"'<>,.?/-]/g, '');
        setUser({ ...user, [e.target.name]: confirmPasswordCheck });
        setInputConfirmPassword(confirmPasswordCheck);
    };

    const isError = input === '';
    const isErrorMobile = inputMobile === '';
    const isErrorEmail = inputEmail === '';
    const isErrorPassword = inputPassword === '';
    const isErrorConfirmPassword = inputConfirmPassword === '' || inputPassword !== inputConfirmPassword;

    const nameValid = useRef(null);
    const validMobile = useRef(null);
    const emailValid = useRef(null);
    const passwordValid = useRef(null);
    const confirmPasswordValid = useRef(null);

    const submitData = async (e) => {
        e.preventDefault();

        if (!user.name) {
            Notiflix.Notify.failure('Please Enter Your Name!');
            nameValid.current.focus();
        } else if (!user.mobile) {
            Notiflix.Notify.failure("Enter Your Mobile!");
            validMobile.current.focus();
        } else if (user.mobile.length !== 10) {
            Notiflix.Notify.failure("Please Enter A Valid Mobile Number!");
            validMobile.current.focus();
        } else if (!user.email) {
            Notiflix.Notify.failure("Please Enter Your Email Address!");
            emailValid.current.focus();
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            Notiflix.Notify.failure("Please Enter A Valid Email Address!");
            emailValid.current.focus();
        } else if (!user.password) {
            Notiflix.Notify.failure("Please Enter Your Password!");
            passwordValid.current.focus();
        } else if (user.password.length < 6) {
            Notiflix.Notify.failure("Password must be at least 6 characters long!");
            passwordValid.current.focus();
        } else if (!user.confirmPassword) {
            Notiflix.Notify.failure("Please Confirm Your Password!");
            confirmPasswordValid.current.focus();
        } else if (user.password !== user.confirmPassword) {
            Notiflix.Notify.failure("Password and Confirm Password do not match!");
            confirmPasswordValid.current.focus();
        } else {
            const formData = new FormData();
            formData.append('name', user.name);
            formData.append('mobile', user.mobile);
            formData.append('email', user.email);
            formData.append('password', user.password);

            try {
                console.log(user)
                const res = await addUser(user);
                console.log("SIGNUP", res)
                if (res.status === 201) {
                    console.log(res.token)
                    localStorage.setItem("token", res.token);
                    Notiflix.Notify.success('Successfully Registered ! Redirecting to Home...')
                    onClose(); // Redirect to home or dashboard
                    setTimeout(() => {
                        window.location.replace("/home");
                    }, 1000);
                    setUser({ name: '', email: '', password: '', mobile: '', confirmPassword: '' });
                } else if (res.status === 409) {
                    Notiflix.Notify.warning("User already exists");
                    switchToLogin();
                    setInput("");
                    setInputEmail("");
                    setInputMobile("");
                    setInputPassword("");
                    setInputConfirmPassword("");
                } else {
                    Notiflix.Notify.failure("Something went wrong!");
                }
            } catch (error) {
                Notiflix.Notify.failure("Something went wrong!");
                console.error("Error adding user:", error);
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create Your Account</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={submitData}>
                        <div className="row">
                            <div className="col-12">
                                {/* Name */}
                                <FormControl isInvalid={isError}>
                                    <FormLabel>Name</FormLabel>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={input}
                                        ref={nameValid}
                                        onChange={handleInputChange}
                                    />
                                    {isError ? <FormErrorMessage>Name is required.</FormErrorMessage> : <FormHelperText>Looks good!</FormHelperText>}
                                </FormControl>

                                {/* Mobile */}
                                <FormControl isInvalid={isErrorMobile} mt={4}>
                                    <FormLabel>Mobile</FormLabel>
                                    <Input
                                        type="text"
                                        name="mobile"
                                        value={inputMobile}
                                        ref={validMobile}
                                        onChange={handleMobile}
                                    />
                                    {isErrorMobile ? <FormErrorMessage>Mobile is required.</FormErrorMessage> : <FormHelperText>Looks good!</FormHelperText>}
                                </FormControl>

                                {/* Email */}
                                <FormControl isInvalid={isErrorEmail}>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={inputEmail}
                                        ref={emailValid}
                                        onChange={handleEmail}
                                    />
                                    {isErrorEmail ? <FormErrorMessage>Email is required.</FormErrorMessage> : <FormHelperText>Looks good!</FormHelperText>}
                                </FormControl>

                                {/* Password */}
                                <FormControl isInvalid={isErrorPassword || (inputPassword.length > 0 && inputPassword.length < 6)} mt={4}>
                                    <FormLabel>Password</FormLabel>
                                    <Input
                                        type="password"
                                        name="password"
                                        value={inputPassword}
                                        ref={passwordValid}
                                        onChange={handlePassword}
                                    />
                                    {isErrorPassword || inputPassword.length < 6
                                        ? <FormErrorMessage>{inputPassword.length < 6 ? "At least 6 characters" : "Password is required."}</FormErrorMessage>
                                        : <FormHelperText>Looks good!</FormHelperText>}
                                </FormControl>



                                {/* Confirm Password */}
                                <FormControl isInvalid={isErrorConfirmPassword} mt={4}>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <Input
                                        type="password"
                                        name="confirmPassword"
                                        value={inputConfirmPassword}
                                        ref={confirmPasswordValid}
                                        onChange={handleConfirmPassword}
                                    />
                                    {isErrorConfirmPassword
                                        ? <FormErrorMessage>{inputConfirmPassword === '' ? "Required" : "Passwords do not match"}</FormErrorMessage>
                                        : <FormHelperText>Passwords match!</FormHelperText>}
                                </FormControl>
                            </div>
                        </div>

                        <ModalFooter mt={6} justifyContent="space-between">
                            <Text fontSize="sm" align="center" paddingTop="15px">
                                Already have an account?{' '}
                                <Link onClick={switchToLogin} style={{ color: "#4caf50", textDecoration: "underline" }}>Login</Link>
                            </Text>
                            <Button type="submit" style={{ backgroundColor: "#4caf50", color: "white" }} ml={4}>Register</Button>
                        </ModalFooter>


                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default SignUp;
