import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import { Facebook, Google } from "@mui/icons-material";
import { TextField, Button, Container, Typography, Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { getUserID, updateUser } from "../../services/userServices";
import { jwtDecode } from "jwt-decode";

function ResponsiveDrawer(props) {
  const [formData, setFormData] = React.useState({
    fullname: "",
    username: "",
    birthdate: "",
    gender: "",
    phone: "",
    mail: "",
    street: "",
    city: "",
  });
  const [avatar, setAvatar] = React.useState(null);
  const [avatarPreview, setavatarPreview] = React.useState(null);
  const Navigate = useNavigate();
  const { id } = useParams();
  const todayDate = new Date().toISOString().split("T")[0];
  const token = localStorage.getItem("token");
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserID(id, token);
        const userData = response.data.user;
        const date = new Date(userData.birthdate).toISOString().split("T")[0];
        setFormData({
          fullname: userData.fullname || "",
          userID: userData.userID || "",
          username: userData.username || "",
          birthdate: date || "",
          gender: userData.gender || "",
          phone: userData.phone || "",
          mail: userData.email || "",
          street: userData.street || "",
          city: userData.city || "",
        });
        if (userData.img) {
          setAvatar(userData.img);
        } else {
          setAvatar(null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        Navigate("/500");
      }
    };

    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e?.target?.files[0];
    const file1 = e?.target?.files[0];
    // console.log(file1);
    if (file && file1) {
      setAvatar(file);
      setavatarPreview(URL.createObjectURL(file1));
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true before making the API request

    const userData = jwtDecode(token);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (avatar) {
        data.append("img", avatar);
      }

      // Make a PUT request with the FormData
      const response = await updateUser(id, data, token);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error editing profile:", error);
      toast.error(error.response.data.message);
      Navigate("/500");
    } finally {
      setLoading(false); // Set loading to false after the API request is completed
    }
  };

  return (
    <>
      <Box>
        <Toolbar />

        {/* EDIT PROFILE */}
        <Container className="w-full lg:max-w-[calc(100%-6rem)] mx-auto">
          <Grid container spacing={3}>
            {/* Left Grid */}
            <Grid item xs={12} sm={12} md={3}>
              <Paper
                elevation={3}
                style={{ height: "100%", padding: "26px 34px" }}
              >
                <div className="account-settings">
                  <div className="user-profile mx-0 mb-1 pb-1 text-center">
                    <div className="user-avatar mb-1">
                      <label
                        htmlFor="avatarInput"
                        className="block cursor-pointer"
                      >
                        <Avatar
                          src={avatarPreview || `${avatar}`}
                          alt="Avatar"
                          className="w-[150px] h-[150px] object-cover mx-auto max-w-full max-h-full border-2 border-white-500 rounded-full shadow-md "
                        />

                        <input
                          type="file"
                          accept="image/*"
                          id="avatarInput"
                          name="avatar"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <Typography
                      variant="h6"
                      className="user-name mt-2 mb-0 font-semibold text-[#10375C]"
                    >
                      {formData.username}
                    </Typography>
                    <Typography
                      variant="h8"
                      className="user-email text-sm font-normal text-gray-600"
                    >
                      {formData.mail}
                    </Typography>
                  </div>
                  <div className="about mt-8 text-center">
                    <Typography
                      variant="h5"
                      className="mb-4 text-[#10375C] font-semibold text-[22px]"
                    >
                      About
                    </Typography>
                    <Typography variant="body1" className="text-[16px]">
                      I'm {formData.username}. Full Stack Designer I enjoy
                      creating user-centric, delightful and human experiences.
                    </Typography>
                    <div className="text-center mt-5">
                      <Facebook
                        fontSize="large"
                        className="cursor-pointer text-blue-600 hover:text-blue-800 mx-2"
                      />
                      <Google
                        fontSize="large"
                        className="cursor-pointer text-red-600 hover:text-red-800 mx-2"
                      />
                    </div>
                  </div>
                </div>
              </Paper>
            </Grid>

            {/* Right Grid */}
            <Grid item xs={12} sm={12} md={9}>
              <Paper elevation={3} style={{ height: "100%", padding: "30px" }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      className="text-primary text-[#10375C]"
                    >
                      Personal Details
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="fullname"
                      type="text"
                      placeholder="Enter full name"
                      variant="outlined"
                      value={formData.fullname}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="username"
                      disabled
                      placeholder="Username"
                      variant="outlined"
                      value={formData.username}
                      fullWidth
                      className="bg-gray-200"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="useId"
                      type="text"
                      variant="outlined"
                      className="bg-gray-200"
                      value={formData.userID}
                      disabled
                      // onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <select
                      id="gender"
                      name="gender" // add name attribute
                      className="border-2 p-[16px] w-full rounded-md"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="birthdate"
                      name="birthdate" // add name attribute
                      label="Date of Birth"
                      variant="outlined"
                      value={formData.birthdate}
                      onChange={handleChange}
                      fullWidth
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        max: todayDate, // Set the maximum allowed date
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="mail"
                      variant="outlined"
                      placeholder="Enter mail"
                      className="bg-gray-200"
                      value={formData.mail}
                      disabled
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="phone"
                      type="tel"
                      variant="outlined"
                      value={formData.phone}
                      onChange={handleChange}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                        if (e.target.value.length > 10) {
                          e.target.value = e.target.value.slice(0, 10);
                        }
                      }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      className="mt-6 text-primary text-[#10375C]"
                    >
                      Address
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="street"
                      label="Street"
                      variant="outlined"
                      value={formData.street}
                      onChange={handleChange}
                      fullWidth
                      placeholder="Enter Street"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="city"
                      label="City"
                      variant="outlined"
                      value={formData.city}
                      onChange={handleChange}
                      fullWidth
                      placeholder="Enter City"
                    />
                  </Grid>
                </Grid>

                {/* BUTTON */}
                <Grid container spacing={4} className="mt-1">
                  <Grid item xs={12}>
                    <div className="text-right">
                      {loading ? (
                        <button
                          disabled
                          type="button"
                          className="bg-[#10375C] hover:bg-[#10375C]-100 text-white rounded-md px-4 py-2"
                        >
                          <svg
                            aria-hidden="true"
                            role="status"
                            class="inline w-4 h-4 me-3 text-white animate-spin"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="#E5E7EB"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentColor"
                            />
                          </svg>
                          Loading...
                        </button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ borderRadius: "5px" }}
                          className="bg-[#10375C] hover:bg-[#10375C]-100 text-white rounded-md px-4 py-2"
                          onClick={handleEditProfile}
                        >
                          Update
                        </Button>
                      )}
                    </div>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
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
    </>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;
