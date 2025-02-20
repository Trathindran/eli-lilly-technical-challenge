const API_URL = 'http://localhost:8000/medicines';

//This function fetches all the medicine from the backend and logs it in the console. Afterwards it calls the show() method to display the medicine in the form of a table
async function fetchMedicine(url){
    try{
        await fetch(url)
        .then((response) => response.json())
        .then((data) => {
            console.log(data.medicines)
            show(data.medicines);
        });
    }catch(error){
        console.error("Error fetching medicine: ", error);
    }
}

fetchMedicine(API_URL);

//This function displays the medicine in the form of a table by iterating through each entry and creating a table row and populating it with the name and price
function show(medicines){
    let tab = `
    <tr>
        <th>Name</th>
        <th>Price</th>
    </tr>`;

    for (let r of medicines){
        const name = r.name ? r.name : "Unknown Name";
        const price = r.price !== null ? `$${r.price}` : "Price Unavailable";
        tab += `
        <tr>
            <td>${name}</td>
            <td>${price}</td>
        </tr>`;
    }

    document.getElementById("medicine-table").innerHTML = tab;
}

//This section of code handles the backend functionality of the create form.
const form = document.querySelector("#create-form");
const create_URL = 'http://localhost:8000/create';

async function createMedicine(){
    const formData = new FormData(form);
    
    const name = formData.get("name");
    const price = formData.get("price");

    fetchMedicine

    if (!name || isNaN(price)){
        alert("Please provide a valid name and price.");
        return;
    }

    try{
        const response = await fetch(create_URL, {
            method: "POST",
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                name: formData.get("name"),
                price: formData.get("price"),
            }),
        });
        const result = await response.json();
        if (response.ok){
            fetchMedicine(API_URL);
            form.reset();
        }
        else{
            alert("Failed to create medicine: " + (result.error || "Unknown error"));
        }
    }catch(e){
        console.error("Error creating medicine:", e);
    }
}


form.addEventListener("submit", (event) =>{
    event.preventDefault();
    createMedicine();
});

//This section of code handles the backend for the search form
const searchform = document.querySelector('#search-form');
const pricefield = document.getElementById("medicine-price");

async function searchMedicine(name){
    try{
        const response = await fetch(`${API_URL}/${encodeURIComponent(name)}`);
        const data = await response.json();

        if (response.ok){
            if (data.error){
                pricefield.textContent = `Medicine "${name}" not found.`;
            }
            else if (data.price !== undefined && data.price !== null){
                pricefield.textContent = `Price of ${data.name}: $${data.price}`;
            }
            else{
                pricefield.textContent = "An error occured while fetching the price.";
            }
        }
    }
    catch (error){
        console.error("Error fetching price: ", error);
        pricefield.textContent = "An error occured while fetching the price.";
    }
}

searchform.addEventListener("submit", (event) =>{
    event.preventDefault();
    const medicineName = document.getElementById("medicine-name").value;
    if (medicineName){
        searchMedicine(medicineName);
    }
    else{
        pricefield.textContent = "Please enter a medicine name.";
    }
})

//This section handles the backend for the update form
const updateform = document.querySelector("#update-form");
const update_URL = 'http://localhost:8000/update';

async function updateMedicine(){
    const formData = new FormData(updateform);

    const name = formData.get("name");
    const price = formData.get("price");

    try{
        const response = await fetch(update_URL, {
            method: "POST",
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                name: formData.get("name"),
                price: formData.get("price"),

            }),
        });
        const result = await response.json();
        if (response.ok){
            fetchMedicine(API_URL);
            updateform.reset();
        }
        else{
            alert("Failed to update medicine: " + (result.error || "Unknown error"));
        }
    }
    catch(e){
        console.error("Error updating medicine:", e);
    }
}

updateform.addEventListener("submit", (event) =>{
    event.preventDefault();
    updateMedicine();
});

//This section handles the backend for the delete form
const deleteform = document.querySelector('#delete-form');
const delete_URL = 'http://localhost:8000/delete';

async function deleteMedicine(){
    const formData = new FormData(deleteform);
    const name = formData.get("name");

    try{
        const response = await fetch(delete_URL, {
            method: "DELETE",
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                name: formData.get("name"),
            }),
        });
        const result = await response.json();
        if (response.ok){
            fetchMedicine(API_URL);
            deleteform.reset();
        }
        else{
            alert("Failed to delete medicine: " + (result.error || "Unknown error"));
        }
    }
    catch(e){
        console.error("Error deleting medicine:", e);
    }
}

deleteform.addEventListener("submit", (event) =>{
    event.preventDefault();
    deleteMedicine();
});
