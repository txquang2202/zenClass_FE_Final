import React from "react";
import { Grid, Paper, Avatar, Typography } from "@material-ui/core";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";

function SendMailSuccessPage(props) {
  const paperStyle = {
    padding: "30px 50px 50px 50px",
    height: "200px",
    width: "540px",
    margin: "0 auto",
  };

  const bg = {
    backgroundImage:
      "url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  const avatarStyle = { backgroundColor: "#10375C" };

  return (
    <Grid
      className="font-sans pt-12 h-screen bg-gradient-to-br from-[#10375C] via-blue-700 to-blue-800"
      style={bg}
    >
      <Paper style={paperStyle}>
        <Grid align="center" className="mb-6">
          <Avatar style={avatarStyle}>
            <DoneOutlineIcon />
          </Avatar>
          <h2 className="text-3xl mt-3 mb-2 font-semibold">
            Mail sent successfully
          </h2>
          <Typography className="text-[#3B5998]">
            Please check your mail !
          </Typography>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default SendMailSuccessPage;
