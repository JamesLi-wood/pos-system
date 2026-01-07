"use server";

type dataFields = {
  username: string;
  password: string;
};

export async function login(formData: FormData) {
  const data: dataFields = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.username,
        password: data.password,
      }),
    }
  );

  if (response.ok) {
    const data = await response.json();
    return { token: data.token };
  } else {
    const error = await response.json();
    return { error: error.message };
  }
}
