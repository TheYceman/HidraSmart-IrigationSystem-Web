/* sección [Conseguir válvulas] fetchValves */

export async function fetchValves(bbdd) {
  if (!bbdd || typeof bbdd !== 'string') {
    console.error('Invalid database name:', bbdd);
    throw new Error('Database name must be a non-empty string');
  }
  try {
    const response = await fetch(`/api/getAllValves/${encodeURIComponent(bbdd)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Response status:', response.status, 'Response OK:', response.ok);

    if (!response.ok) {
      const text = await response.text();
      console.error('Non-OK response:', text);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (!response.headers.get('Content-Type')?.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      throw new Error('Expected JSON, received ' + response.headers.get('Content-Type'));
    }

    const data = await response.json();
    console.log('DATA RESULT:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error.message);
    throw error;
  }
}

/* [Fin de sección] */