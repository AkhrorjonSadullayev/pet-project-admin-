import styled from "styled-components";

// Container for the Sign In page
export  const Signcontainer = styled.div`
  background-image: url('https://static.vecteezy.com/system/resources/previews/001/337/984/non_2x/pet-shop-banner-with-french-bulldogs-free-vector.jpg');
  background-size: cover;
  background-position: center; 
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vh;
`;

export const InsideCon = styled.div`
  background-color:  #d68910 ; /* Rangni qo'shish */
  padding: 40px 60px 40px 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  margin: auto; /* Elementni markazga joylashtirish */
`;

export const Title = styled.h1`
  color: black; /* Oq rangli matn */
  text-align: center;
  font-size: 2.4rem;
  margin-bottom: 20px;
  font-weight: 600;
  letter-spacing: 1px; /* Harflar orasini kengaytirish */
`;

export const Label = styled.label`
  color: black; /* Oq rangli matn */
  font-size: 1rem;
  margin-bottom: 8px;
  display: block;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 12px 0;
  border-radius: 8px;
  border: 1px solid #fff;
  background-color: #1e8449 ; /* Sariq rangning ochiq tonlari */
  color: #333;
  font-size: 1rem;
  transition: border-color 0.3s ease; /* Yumuqoq fokus efekti */

  &::placeholder {
    color: #bdc3c7;
  }

  &:focus {
    outline: none;
    border-color: #1abc9c; /* Fokusda yashil rangli chiziq */
  }
`;

export const Button = styled.button`
  background-color: #1e8449; /* Yashil rang */
  color: white;
  padding: 14px;
  border: none;
  border-radius: 8px;
  width: 100%;
  font-size: 1.2rem;
  cursor: pointer;
  margin-top: 12px;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #16a085;
    transform: scale(1.05); /* Hoverda kichik o'sish efekti */
  }

  &:focus {
    outline: none;
  }
`;

export const ChekboxMain = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

