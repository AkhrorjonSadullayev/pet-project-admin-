












import axios from "axios";
import { InsideCon, Signcontainer, Title, Label, Input, Button, } from "./styles/admin.style";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseApi } from "../utils/api";

interface LoginResponse {
  success: boolean;
  access_token: string;
}

const SignIn = () => {
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

  return (
    <Signcontainer>
      <div className="sign-con">
        <InsideCon>
          <Title>Log In</Title>
          <form onSubmit={handleLogin}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={email}
                onChange={handleChangeInput}
                type="email"
                className="email-input"
                placeholder="Email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                value={password}
                onChange={handleChangeInput}
                type="password"
                className="email-input"
                placeholder="Password"
                required
              />
            </div>
            {errorMsg && <div style={{ color: "red", marginTop: "10px" }}>{errorMsg}</div>} {/* Xato xabarini ko'rsatish */}
            <Button type="submit" className="sign-but" disabled={isLoading}>
              {isLoading ? "Logging in..." : "LOG IN"} {/* Loading holatida matnni o'zgartirish */}
            </Button>
          </form>
        </InsideCon>
      </div>
    </Signcontainer>
  );
};

export default SignIn;
