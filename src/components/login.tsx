import { CssVarsProvider, extendTheme, useColorScheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton, { IconButtonProps } from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import axios from "axios";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseApi } from "../utils/api";

interface LoginResponse {
  success: boolean;
  access_token: string;
}
export default function JoySignInSideTemplate() {
const [errorMsg, setErrorMsg] = useState<string>("");
const [email, setEmail] = useState<string>("");
const [password, setPassword] = useState<string>("");
const [isLoading, setIsLoading] = useState<boolean>(false);  // Loading holati
const navigate = useNavigate();

const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setErrorMsg(""); // Har safar error xabarini tozalash
  setIsLoading(true);  // Loading holatini faollashtirish

  // Email va parol bo'shligini tekshirish
  if (!email || !password) {
    setErrorMsg("All fields are required.");
    setIsLoading(false); // Loading holatini tugatish
    return;
  }

  try {
    // Login API so'rovi
    const { data } = await axios.post<LoginResponse>(`${baseApi}/user/login-admin`, { email, password });
    
    if (data.success && data.access_token) {
      // Tokenni localStorage ga saqlash
      localStorage.setItem("token", data.access_token);
      toast.success("Successfully Logged In!");
      setEmail("");
      setPassword("");
      console.log("Access token: ", data.access_token);  // Tokenni tekshirish
      navigate("/users"); // Asosiy sahifaga yo'naltirish
    } else {
      setErrorMsg("Login failed. Please try again.");
    }
  } catch (error: any) {
    // API'dan qaytgan xatolarni ko'rsatish
    if (error.response) {
      if (error.response.status === 401) {
        setErrorMsg("Invalid email or password.");
      } else {
        setErrorMsg(error.response.data.message || "An error occurred. Please try again.");
      }
    } else {
      setErrorMsg("Network error. Please try again.");
    }
  } finally {
    setIsLoading(false);  // Loading holatini tugatish
  }
};

const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  if (name === "email") setEmail(value);
  if (name === "password") setPassword(value);
};
function ColorSchemeToggle(props: IconButtonProps) {
  const { onClick, ...other } = props;
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <IconButton
      aria-label="toggle light/dark mode"
      size="sm"
      variant="outlined"
      disabled={!mounted}
      onClick={(event) => {
        setMode(mode === 'light' ? 'dark' : 'light');
        onClick?.(event);
      }}
      {...other}
    >
      {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}

const customTheme = extendTheme({ defaultColorScheme: 'dark' });

  return (
    <CssVarsProvider theme={customTheme} disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--Form-maxWidth': '800px',
            '--Transition-duration': '0.4s', // set to `none` to disable transition
          },
        }}
      />
      <Box
        sx={(theme) => ({
          width: { xs: '100%', md: '50vw' },
          transition: 'width var(--Transition-duration)',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255 255 255 / 0.2)',
          [theme.getColorSchemeSelector('dark')]: {
            backgroundColor: 'rgba(19 19 24 / 0.4)',
          },
        })}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100dvh',
            width: '100%',
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{ py: 3, display: 'flex', justifyContent: 'space-between' }}
          >
            <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
              <IconButton variant="soft" color="primary" size="sm">
                <BadgeRoundedIcon />
              </IconButton>
              <Typography level="title-lg">Pet Project</Typography>
            </Box>
            <ColorSchemeToggle />
          </Box>
          <Box
            component="main"
            sx={{
              my: 'auto',
              py: 2,
              pb: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: 400,
              maxWidth: '100%',
              mx: 'auto',
              borderRadius: 'sm',
              '& form': {
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              },
              [`& .MuiFormLabel-asterisk`]: {
                visibility: 'hidden',
              },
            }}
          >
            <Stack sx={{ gap: 4, mt: 2 }}>
              <form
              onSubmit={handleLogin}
              >
                <FormControl required>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input type="email" name="email"value={email}
                onChange={handleChangeInput}
                className="email-input"
                placeholder="Email"
                required />
                </FormControl>
                <FormControl required>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input type="password" name="password"  id="password"
                value={password}
                onChange={handleChangeInput}
                className="email-input"
                placeholder="Password"
                required/>
                </FormControl>
                <Stack sx={{ gap: 4, mt: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                  </Box>
                  {errorMsg && <div style={{ color: "red", marginTop: "10px" }}>{errorMsg}</div>} {/* Xato xabarini ko'rsatish */}
            <Button type="submit" className="sign-but" disabled={isLoading}>
              {isLoading ? "Logging in..." : "LOG IN"} {/* Loading holatida matnni o'zgartirish */}
            </Button>
                </Stack>
              </form>
            </Stack>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" sx={{ textAlign: 'center' }}>
              © Your company {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          height: '100%',
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: '50vw' },
          transition:
            'background-image var(--Transition-duration), left var(--Transition-duration) !important',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          backgroundColor: 'background.level1',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage:
            'url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)',
          [theme.getColorSchemeSelector('dark')]: {
            backgroundImage:
              'url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)',
          },
        })}
      />
    </CssVarsProvider>
  );
}