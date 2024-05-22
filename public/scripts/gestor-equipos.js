async function updateContador(id) {
    alert(id);
    const sector = document.querySelector(`[data-field="sector"][data-id="${id}"]`).textContent;
    const tramo = document.querySelector(`[data-field="tramo"][data-id="${id}"]`).textContent;
    const data = {
        id: id,
        sector: sector,
        tramo: tramo,
      };
    
    fetch("/gestor-equipos/actualizarContador", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        })
        .then((response) => {
            if (response.ok) {
                alert('Contador actualizado correctamente');
            } else {
                alert('Error al actualizar el contador' + response);
            }
        })
        .catch((error) => {
            console.error('Error en la solicitud: ' + error.message);
        });

}


async function borrarContador(id) {
    alert(id);

    if (confirm("¿Estás seguro de que deseas eliminar este elemento?")) {
        const data = {
            id: id,
        };
        
        const response = await fetch("/gestor-equipos/borrarContador", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then((response) => {
                if (response.ok) {
                    alert('Contador ' +  id + ' eliminado ');
                } else {
                    alert('Error al eliminar el contador' + response);
                }
            })
            .catch((error) => {
                console.error('Error en la solicitud: ' + error.message);
            });
           //const data = await response.json();
           console.log("Response " + response);
      } else {
        // Si el usuario hace clic en "Cancelar", no hagas nada.
        console.log("Eliminación cancelada");
      }


   
}


function exportTableToExcel(tableID, filename = '') {
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
  
    // Specify file name
    filename = filename ? filename + '.xls' : 'excel_data.xls';
  
    // Create download link element
    downloadLink = document.createElement("a");
  
    document.body.appendChild(downloadLink);
  
    if (navigator.msSaveOrOpenBlob) {
      var blob = new Blob(['ufeff', tableHTML], {
        type: dataType
      });
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      // Create a link to the file
      downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
  
      // Setting the file name
      downloadLink.download = filename;
  
      //triggering the function
      downloadLink.click();
    }
  }
  