export type UserFormData = {
  name: string;
  email: string;
  age: number;
};

export type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
};

export type Video = {
  id: string;
  title: string;
  url: string;
  duration: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  duration: string;
  category: string;
  image: string;
  videos?: Video[];
};
