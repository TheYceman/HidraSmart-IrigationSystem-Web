export async function fetchValves() {
    const bbdd = "hidrasmart_is_bx";
    const response = await fetch(`/api/getAllValves/hidrasmart_is_bx`);
    console.log("Response status:", response.status, "Response OK:", response.ok);

    if (!response.ok) {
        const text = await response.text(); // Get raw response text
        console.error("Non-JSON response:", text);
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("DATA RESULTALTWLES:", data);
    return data;
}