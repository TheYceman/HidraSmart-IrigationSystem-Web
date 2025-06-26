export async function fetchUserData() {
  try {
    //Conseguir de la base de datos los datos del usuario, de forma provisional, hasta crear un contexto global
    const response = await fetch('/api/getUserDataProv', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error:', data.message || 'Failed to fetch user data');
      //throw new Error(data.message || 'Failed to fetch user data');
    }

    if (data.success) {
      return data;
    } else {
      console.error('Request failed:', data.message);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Fetch user data error:', error.message);
    throw error;
  }
}
