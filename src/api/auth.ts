import axios from "axios";

const API_URL = "https://expensehive.onrender.com/auth";

export const registerUser = async (data: { name: string; email: string; password: string }) => {
  const res = await axios.post(`${API_URL}/register`, data);
  return res.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await axios.post(`${API_URL}/login`, data);
  return res.data;
};
