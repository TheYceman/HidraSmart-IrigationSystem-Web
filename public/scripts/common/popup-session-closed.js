function popupSessionClosed(){
    Swal.fire({
            
        title: `<img class="img_show_message" src="/images/icons/icon-exit.png" width="60" height="60">`,
        html: `
            <style>
                .container {
                    height: 20vh;
                    font-family: "Montserrat", sans-serif;
                    -webkit-animation: 15s 0.875s cubic-bezier(0.9, 0, 0.1, 1) forwards background_color;
                            animation: 15s 0.875s cubic-bezier(0.9, 0, 0.1, 1) forwards background_color;
                }
                .animation_number {
                    width: 15vmin;
                    height: 15vmin;
                    box-shadow: 0 0 0 1.875vmin, inset 0.75vmin 0.75vmin 2.5vmin rgba(96, 207, 255, 0.125), 0.75vmin 0.75vmin 2.5vmin rgba(96, 207, 255, 0.125);
                    font-size: 10vmin;
                    text-shadow: 0.75vmin 0.75vmin 2.5vmin rgba(96, 207, 255, 0.125);
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    color: white;
                    border-radius: 50%;
                    font-weight: 150;
                    background-color: #60cfff;
                  }
                  .animation_number:before {
                    content: "15";
                    -webkit-animation: 15s 1s forwards timer_countdown, 1s 0.875s 15 timer_beat;
                            animation: 15s 1s forwards timer_countdown, 1s 0.875s 15 timer_beat;
                  }
                  @-webkit-keyframes timer_beat {
                    40%, 80% {
                      transform: none;
                    }
                    50% {
                      transform: scale(1.125);
                    }
                  }
                  @keyframes timer_beat {
                    40%, 80% {
                      transform: none;
                    }
                    50% {
                      transform: scale(1.125);
                    }
                  }
                  
                  @keyframes timer_countdown {
                    0% {
                      content: "15";
                    }
                    6.6666666667% {
                      content: "14";
                    }
                    13.3333333333% {
                      content: "13";
                    }
                    20% {
                      content: "12";
                    }
                    26.6666666667% {
                      content: "11";
                    }
                    33.3333333333% {
                      content: "10";
                    }
                    40% {
                      content: "9";
                    }
                    46.6666666667% {
                      content: "8";
                    }
                    53.3333333333% {
                      content: "7";
                    }
                    60% {
                      content: "6";
                    }
                    66.6666666667% {
                      content: "5";
                    }
                    73.3333333333% {
                      content: "4";
                    }
                    80% {
                      content: "3";
                    }
                    86.6666666667% {
                      content: "2";
                    }
                    93.3333333333% {
                      content: "1";
                    }
                    100% {
                      content: "0";
                    }
                  }
                  .animation_number:after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: -100;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.125);
                    -webkit-animation: 15s 1s linear forwards timer_indicator;
                            animation: 15s 1s linear forwards timer_indicator;
                  }
                  @-webkit-keyframes timer_indicator {
                    100% {
                      transform: translateY(100%);
                    }
                  }
                  @keyframes timer_indicator {
                    100% {
                      transform: translateY(100%);
                    }
                  }
            </style>
            <div class="container">
                <div class="animation_number"></div>
            </div>
        `,
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Cerrar sesión",
        timer: 15000, 
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
          window.location.href = "/logout";
        //     // Realizar una solicitud al servidor para cerrar la sesión
        //     fetch("/logout", {
        //         method: "POST", // Utiliza el método POST para enviar la solicitud
        //         headers: {
        //             "Content-Type": "application/json"
        //         }
        //     })
        //     .then(response => {
        //         if (response.ok) {
        //             // Si la solicitud de logout es exitosa, redirige al usuario a '/'
        //             window.location.href = "/";
        //         } else {
        //             // Si hay algún error en la solicitud de logout, maneja el error adecuadamente
        //             console.error('Error al cerrar sesión:', response.statusText);
        //             // Puedes mostrar un mensaje de error al usuario o realizar otra acción
        //         }
        //     })
        //     .catch(error => {
        //         console.error('Error al cerrar sesión:', error);
        //         // Puedes mostrar un mensaje de error al usuario o realizar otra acción
        //     });
        }
    });    
}