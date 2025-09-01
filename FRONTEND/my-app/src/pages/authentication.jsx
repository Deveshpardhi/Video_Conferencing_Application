import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';

const defaultTheme = createTheme();

export default function Authentication() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [formState, setFormState] = React.useState(0); // 0 = sign in, 1 = sign up
  const [open, setOpen] = React.useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  // Keep one random image per mount (doesn't flicker on rerenders)
  const bgUrl = React.useMemo(
    () => `https://picsum.photos/1600/900?random=${Math.floor(Math.random()*1e9)}`,
  );

  const handleAuth = async (e) => {
    e?.preventDefault?.();
    setError("");

    try {
      if (formState === 0) {
        await handleLogin(username.trim(), password);
        // on success your context navigates to /home
      } else {
        const result = await handleRegister(name.trim(), username.trim(), password);
        setMessage(result || "Registered successfully");
        setOpen(true);
        setFormState(0);
        setPassword("");
      }
    } catch (err) {
      const apiMsg = err?.response?.data?.message;
      setError(apiMsg || "Something went wrong. Please try again.");
    }
  };

  const handleCloseSnackbar = () => setOpen(false);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />

        {/* LEFT: Background image (hidden on XS for cleaner mobile) */}
        <Grid
          item
          xs={false}
          sm={6}
          md={7}
          sx={{
            order: { xs: 2, md: 1 },
            // soft overlay + image
            backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url("${bgUrl}")`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* RIGHT: Auth form */}
        <Grid
          item
          xs={12}
          sm={6}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{ order: { xs: 1, md: 2 } }}
        >
          <Box
            sx={{
              my: 8,
              mx: { xs: 3, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: 420,
              width: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>

            {/* Tabs-like toggle */}
            <Box sx={{ display: 'flex', gap: 1, mt: 1, mb: 2 }}>
              <Button
                variant={formState === 0 ? 'contained' : 'text'}
                onClick={() => setFormState(0)}
              >
                Sign In
              </Button>
              <Button
                variant={formState === 1 ? 'contained' : 'text'}
                onClick={() => setFormState(1)}
              >
                Sign Up
              </Button>
            </Box>

            <Box component="form" noValidate sx={{ mt: 1, width: '100%' }} onSubmit={handleAuth}>
              {formState === 1 && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  name="fullName"
                  value={name}
                  autoFocus
                  onChange={(e) => setName(e.target.value)}
                />
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={username}
                autoFocus={formState === 0}
                onChange={(e) => setUsername(e.target.value)}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                value={password}
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && (
                <p style={{ color: 'red', marginTop: 8, marginBottom: 0 }}>{error}</p>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={
                  formState === 0
                    ? !username.trim() || !password
                    : !name.trim() || !username.trim() || !password
                }
              >
                {formState === 0 ? 'Login' : 'Register'}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        message={message}
        onClose={handleCloseSnackbar}
      />
    </ThemeProvider>
  );
}
