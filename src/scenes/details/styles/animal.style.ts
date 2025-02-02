import styled from "styled-components";


export const AnimalContainer = styled.div`
display: flex;
flex-direction:column;
align-items: center;
gap: 14px;
text-align: center;
max-width: 420px;
width: 100%;
padding: 20px;
border: 1px solid #ddd;
border-radius: 12px;
background-color: white;
box-shadow: "0 4px 10px rgba(0, 0, 0, 0.1)";
.title{
    margin: 0;
    font-size: 20px;
    color: #2c3e50;
    font-weight: bold;
}
.type-con{
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 12px;
    padding: 10px;
    background-color: #f4f4f4;
    border-radius: 8px;
    h3{
        margin: 0;
        font-size: 16px;
        color:#34495e;
    }
}
.desc{
    margin: 0;
    font-size: 14px;
    color:#777;
    font-style: italic;
}
.main-img{
    width: 260px;
    height: 260px;
    border-radius: 10px;
    object-fit: cover;
    border:3px solid #3498db;
}
.details-img{
    width: 80px;
    height: 80px;
    border-radius: 8px;
    object-fit: cover;
    border: 2px solid #ddd;
    cursor: pointer;
    
}
.delete-button{
    margin-top: 14px;
    padding: 10px 18px;
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
    font-weight: bold;
}
`;