      (function () {
        function init() {
          let scripts = document.getElementsByTagName("script");
          console.log(scripts);
          let lastScript = scripts[scripts.length - 1];
          console.log(lastScript);
          let scriptUrl = new URL(lastScript.src);
          console.log(scriptUrl);
          let uniqueId = scriptUrl.searchParams.get("unique_id");
          console.log(uniqueId);

          console.log("Script loaded");
          fetch("http://localhost:3000/api/scriptload", {
            method: "POST",
            body: JSON.stringify({
              loaded: true,
            }),
          })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.error("Error:", error));
          if (window.chatWidgetInitialized) {
            return;
          }
          window.chatWidgetInitialized = true;
          setTimeout(function () {
            const iframe = document.createElement("iframe");
            iframe.setAttribute("id", "payment__widget__iframe");
            iframe.src = "http://localhost:3000/form/" + uniqueId;
            iframe.style.position = "absolute";
            iframe.style.right = "0";
            iframe.style.bottom = "0";
            iframe.style.left = "0";
            iframe.style.top = "0";
            iframe.style.margin = "auto";
            iframe.style.zIndex = "1000";
            iframe.style.border = "none";
            iframe.style.width = "100%";
            iframe.style.bottom = window.innerWidth < 640 ? "0" : "80px";
            iframe.style.right = window.innerWidth < 640 ? "0" : "16px";
            iframe.style.width = window.innerWidth < 640 ? "100%" : "80vw";
            iframe.style.height = window.innerWidth < 640 ? "100%" : "70vh";
            iframe.style.borderRadius = window.innerWidth < 640 ? "0" : "10px";
            iframe.style.boxShadow =
              "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)";
            iframe.style.zIndex = "9999999";
            iframe.style.display = "none";
            document.body.appendChild(iframe);

            const paymentButton = document.getElementById(
              "payment__widget__button"
            );
            // make the payment button disabled

            // remove the hidden class from the paymen button after 2 seconds
            setTimeout(() => {
              paymentButton.disabled = false;
              // change the bg color to blue and text white
              paymentButton.style.backgroundColor = "#232e44";
              paymentButton.style.color = "#fff";
              paymentButton.classList.remove("cursor-not-allowed");
              paymentButton.classList.add("cursor-pointer");
            }, 2000);

            const widgetCloseButton = document.getElementById(
              "payment__widget__close__button"
            );

            if (paymentButton) {
              paymentButton.onclick = () => {
                console.log("clicked");
                fetch("http://localhost:3000/api/triggerbutton", {
                  method: "POST",
                  body: JSON.stringify({
                    triggered: true,
                  }),
                })
                  .then((response) => response.json())
                  .then((data) => console.log(data))
                  .catch((error) => console.error("Error:", error));
                paymentButton.innerHTML = "Loading...";
                setTimeout(() => {
                  iframe.contentWindow.postMessage({ openChat: true }, "*");
                  iframe.style.display = "block";
                  widgetCloseButton.classList.remove("hidden");

                  // create a dark background behind the iframe covering the whole dom
                  const background = document.createElement("div");
                  background.setAttribute("id", "payment__widget__background");
                  background.style.position = "absolute";
                  background.style.right = "0";
                  background.style.bottom = "0";
                  background.style.left = "0";
                  background.style.top = "0";
                  background.style.margin = "auto";
                  background.style.zIndex = "20";
                  background.style.backgroundColor = "#232e4480";
                  background.style.width = "100%";
                  background.style.height = "100%";
                  background.style.display = "block";
                  background.style.backdropFilter = "blur(10px)";
                  document.body.appendChild(background);
                }, 500);
              };
            }

            if (widgetCloseButton) {
              widgetCloseButton.onclick = () => {
                iframe.contentWindow.postMessage({ closeChat: true }, "*");
                iframe.style.display = "none";
                widgetCloseButton.classList.add("hidden");

                // remove the dark background behind the iframe
                const background = document.getElementById(
                  "payment__widget__background"
                );
                background.remove();

                // remove loading text from button
                paymentButton.innerHTML = "Buy Now";
              };
            }

            // Update iframe height on window resize
            window.addEventListener("resize", () => {
              iframe.style.bottom = window.innerWidth < 640 ? "0" : "5rem";
              iframe.style.right = window.innerWidth < 640 ? "0" : "1rem";
              iframe.style.width = window.innerWidth < 640 ? "100%" : "80vw";
              iframe.style.height = window.innerWidth < 640 ? "100%" : "70vh";
              iframe.style.borderRadius =
                window.innerWidth < 640 ? "0" : "10px";
            });

            window.addEventListener("message", (event) => {
              if (event.origin !== "https://widget.sitegpt.ai") {
                return;
              }
              if (event.data.isOpen) {
                iframe.style.display = "block";
                tooltip.style.display = "none";
                toggleButton.innerHTML =
                  '<img src="https://sitegpt.ai/images/x.svg" style="width: 32px; height: 32px;" alt="" /><span class="sr-only">Close Chat</span>';
                toggleButton.style.width = "48px";
                toggleButton.style.height = "48px";
              } else {
                iframe.style.display = "none";
                // tooltip.style.display = 'block';
                toggleButton.innerHTML =
                  '<img src="https://sitegpt.ai/cdn-cgi/imagedelivery/hQTLE0NTlcNyb_tOYFnnyA/e9de7902-7bd8-4af2-fa0d-5a72ff632f00/square" style="width: 56px; height: 56px;" alt="" /><span class="sr-only">Open Chat</span>';
                toggleButton.style.width = "56px";
                toggleButton.style.height = "56px";
              }
            });
          }, 2000);
        }

        if (document.readyState === "complete") {
          init();
        } else {
          window.addEventListener("load", init);
        }
      })();
