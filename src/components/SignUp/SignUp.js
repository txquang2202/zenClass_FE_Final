import React, { useState } from "react";
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  Toolbar,
} from "@material-ui/core";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Link, useNavigate } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerUser } from "../../services/userServices";

const SignUp = () => {
  // LAYOUT
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const paperStyle = {
    padding: "0 50px 50px 50px",
    height: "600px",
    width: "640px",
    margin: "0 auto",
  };

  const signUpButton = {
    color: "#10375C",
    borderBottom: "2px solid #10375C",
    fontWeight: "bold",
    borderRadius: 0,
    paddingLeft: "16px",
    paddingRight: "16px",
  };

  const bg = {
    backgroundImage:
      "url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  // EVENT
  const headerStyle = { margin: 0 };
  const avatarStyle = { backgroundColor: "#10375C" };
  const btnstyle = { margin: "8px 0", backgroundColor: "#10375C" };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = userDetails;

    if (!username || username.length < 3) {
      toast.error("Please enter a valid username with at least 3 characters");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !email.match(emailRegex)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!password || password.length < 6) {
      toast.error("Please enter a valid password with at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Confirm password does not match!!");
      return;
    }

    try {
      const response = await registerUser(username, email, password);

      if (response.status === 200) {
        toast.success("Please verify your email address");
        setTimeout(() => {
          navigate("/send-mail-success");
        }, 1000);
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        console.error("Error while sending registration failed", error);
        toast.error(error.response.data.message);
        navigate("/500");
      }
    }
  };

  return (
    <Grid
      className="font-sans pt-12 h-screen bg-gradient-to-br from-[#10375C] via-blue-700 to-blue-800"
      style={bg}
    >
      <Paper style={paperStyle} className="relative">
        {/* Navigation */}
        <IconButton
          color="inherit"
          component={Link}
          to="/"
          className="absolute top-0 left-[-1px]"
        >
          <ArrowLeftIcon />
        </IconButton>
        <Toolbar className="flex justify-around items-center ">
          <Button color="inherit" component={Link} to="/signin">
            Sign In
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/signup"
            style={signUpButton}
          >
            Sign Up
          </Button>
        </Toolbar>

        <Grid align="center" className="mt-2">
          <Avatar style={avatarStyle}>
            <AddCircleOutlineIcon />
          </Avatar>
          <h2 style={headerStyle}>Sign Up</h2>
          <Typography variant="caption" gutterBottom>
            Please fill this form to create an account !
          </Typography>
        </Grid>
        <form>
          <TextField
            fullWidth
            label="User name"
            placeholder="Enter your name"
            name="username"
            variant="standard"
            value={userDetails.username}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Email"
            placeholder="Enter your email"
            name="email"
            variant="standard"
            value={userDetails.email}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Password"
            placeholder="Enter your password"
            type="password"
            name="password"
            variant="standard"
            value={userDetails.password}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            placeholder="Confirm your password"
            type="password"
            name="confirmPassword"
            variant="standard"
            value={userDetails.confirmPassword}
            onChange={handleInputChange}
            onKeyPress={(e) =>
              e.charCode === 13 && e.code === "Enter" && handleSignUp(e)
            }
          />
          <FormControlLabel
            control={<Checkbox name="checkedA" />}
            label="I accept the terms and conditions."
            className="mt-1"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={btnstyle}
            fullWidth
            onClick={handleSignUp}
          >
            Sign up
          </Button>
        </form>
      </Paper>
      <ToastContainer
        position="bottom-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Grid>
  );
};

export default SignUp;
