(function () {
    const STORAGE_KEY = "homemadeCeramicsProducts";
    const CHAT_HISTORY_KEY = "ceramiBotHistory";

    function getProducts() {
        const savedProducts = localStorage.getItem(STORAGE_KEY);

        if (savedProducts) {
            return JSON.parse(savedProducts);
        }

        if (typeof products !== "undefined") {
            return products;
        }

        return [];
    }

    function createCeramiBot() {
        const botHTML = `
            <style>
                .ceramibot-button {
                    position: fixed;
                    right: 28px;
                    bottom: 28px;
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    border: none;
                    background: #ffe9e2;
                    color: #211f1f;
                    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.16);
                    cursor: pointer;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    transition: 0.3s ease;
                }

                .ceramibot-button:hover {
                    background: #211f1f;
                    color: white;
                    transform: translateY(-4px);
                }

                .ceramibot-window {
                    position: fixed;
                    right: 28px;
                    bottom: 110px;
                    width: 380px;
                    max-width: calc(100vw - 40px);
                    height: 560px;
                    max-height: calc(100vh - 140px);
                    background: white;
                    border: 1px solid #ededed;
                    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.18);
                    z-index: 9999;
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    font-family: Poppins, sans-serif;
                }

                .ceramibot-window.open {
                    display: flex;
                }

                .ceramibot-header {
                    padding: 22px 24px;
                    border-bottom: 1px solid #ededed;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #fafafa;
                }

                .ceramibot-title {
                    font-size: 13px;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    color: #211f1f;
                }

                .ceramibot-subtitle {
                    margin-top: 6px;
                    font-size: 12px;
                    color: #8a8a8a;
                    letter-spacing: normal;
                    text-transform: none;
                }

                .ceramibot-close {
                    border: none;
                    background: transparent;
                    font-size: 22px;
                    cursor: pointer;
                    color: #211f1f;
                }

                .ceramibot-messages {
                    flex: 1;
                    padding: 22px;
                    overflow-y: auto;
                    background: white;
                }

                .ceramibot-message {
                    max-width: 85%;
                    padding: 13px 16px;
                    margin-bottom: 14px;
                    font-size: 14px;
                    line-height: 1.7;
                }

                .ceramibot-message.bot {
                    background: #f6f6f6;
                    color: #211f1f;
                    margin-right: auto;
                }

                .ceramibot-message.user {
                    background: #ffe9e2;
                    color: #211f1f;
                    margin-left: auto;
                }

                .ceramibot-quick {
                    padding: 0 22px 16px;
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    border-top: 1px solid #f2f2f2;
                    padding-top: 16px;
                }

                .ceramibot-chip {
                    border: 1px solid #ededed;
                    background: white;
                    padding: 8px 12px;
                    font-size: 11px;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: 0.3s ease;
                }

                .ceramibot-chip:hover {
                    background: #211f1f;
                    color: white;
                }

                .ceramibot-form {
                    display: flex;
                    border-top: 1px solid #ededed;
                    background: white;
                }

                .ceramibot-input {
                    flex: 1;
                    border: none;
                    outline: none;
                    padding: 18px;
                    font-size: 14px;
                    font-family: Poppins, sans-serif;
                }

                .ceramibot-send {
                    border: none;
                    background: #ffe9e2;
                    padding: 0 22px;
                    cursor: pointer;
                    font-size: 12px;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    transition: 0.3s ease;
                    font-family: Poppins, sans-serif;
                }

                .ceramibot-send:hover {
                    background: #211f1f;
                    color: white;
                }

                @media (max-width: 520px) {
                    .ceramibot-window {
                        right: 14px;
                        left: 14px;
                        width: auto;
                        bottom: 92px;
                    }

                    .ceramibot-button {
                        right: 18px;
                        bottom: 18px;
                    }
                }
            </style>

            <button id="ceramiBotButton" class="ceramibot-button" aria-label="Open CeramiBot">
                <i class="fa-solid fa-comment-dots"></i>
            </button>

            <div id="ceramiBotWindow" class="ceramibot-window">
                <div class="ceramibot-header">
                    <div>
                        <div class="ceramibot-title">CeramiBot</div>
                        <div class="ceramibot-subtitle">Your ceramics shopping assistant</div>
                    </div>

                    <button id="ceramiBotClose" class="ceramibot-close" aria-label="Close CeramiBot">
                        &times;
                    </button>
                </div>

                <div id="ceramiBotMessages" class="ceramibot-messages"></div>

                <div class="ceramibot-quick">
                    <button class="ceramibot-chip" data-question="Recommend a product">Recommend</button>
                    <button class="ceramibot-chip" data-question="How do I care for ceramics?">Care Tips</button>
                    <button class="ceramibot-chip" data-question="Can I use the cart?">Cart</button>
                    <button class="ceramibot-chip" data-question="Do you have workshops?">Workshop</button>
                </div>

                <form id="ceramiBotForm" class="ceramibot-form">
                    <input id="ceramiBotInput" class="ceramibot-input" type="text" placeholder="Ask CeramiBot..." autocomplete="off">
                    <button class="ceramibot-send" type="submit">Send</button>
                </form>
            </div>
        `;

        document.body.insertAdjacentHTML("beforeend", botHTML);
    }

    function addMessage(type, text) {
        const messagesContainer = document.getElementById("ceramiBotMessages");

        const message = document.createElement("div");
        message.className = `ceramibot-message ${type}`;
        message.innerHTML = text;

        messagesContainer.appendChild(message);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        saveChatHistory();
    }

    function saveChatHistory() {
        const messages = [...document.querySelectorAll(".ceramibot-message")].map(message => {
            return {
                type: message.classList.contains("user") ? "user" : "bot",
                text: message.innerHTML
            };
        });

        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    }

    function loadChatHistory() {
        const saved = localStorage.getItem(CHAT_HISTORY_KEY);

        if (!saved) {
            addMessage("bot", "Hi, I’m <strong>CeramiBot</strong>. I can help you choose products, understand ceramic care, wishlist, cart, and workshops.");
            return;
        }

        const messages = JSON.parse(saved);
        const messagesContainer = document.getElementById("ceramiBotMessages");

        messagesContainer.innerHTML = "";

        messages.forEach(item => {
            const message = document.createElement("div");
            message.className = `ceramibot-message ${item.type}`;
            message.innerHTML = item.text;
            messagesContainer.appendChild(message);
        });

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function findProductAnswer(message) {
        const storeProducts = getProducts();

        if (storeProducts.length === 0) {
            return null;
        }

        const lowerMessage = message.toLowerCase();

        const matchedProducts = storeProducts.filter(product => {
            const name = (product.name || "").toLowerCase();
            const category = (product.category || "").toLowerCase();
            const color = (product.color || "").toLowerCase();
            const material = (product.material || "").toLowerCase();

            return (
                lowerMessage.includes(name) ||
                lowerMessage.includes(category) ||
                lowerMessage.includes(color) ||
                lowerMessage.includes(material)
            );
        });

        if (matchedProducts.length === 0) {
            return null;
        }

        const productsToShow = matchedProducts.slice(0, 3);

        return `
            I found these products that may fit your request:<br><br>
            ${productsToShow.map(product => {
                return `• <strong>${product.name}</strong> — $${Number(product.price).toFixed(2)} (${product.category})`;
            }).join("<br>")}
            <br><br>
            You can open the shop page to view more details.
        `;
    }

    function getBotReply(message) {
        const lowerMessage = message.toLowerCase();

        const productAnswer = findProductAnswer(message);
        if (productAnswer) return productAnswer;

        if (
            lowerMessage.includes("recommend") ||
            lowerMessage.includes("suggest") ||
            lowerMessage.includes("best") ||
            lowerMessage.includes("choose")
        ) {
            const storeProducts = getProducts().slice(0, 3);

            if (storeProducts.length === 0) {
                return "I can recommend products once the product list is available.";
            }

            return `
                I recommend starting with these pieces:<br><br>
                ${storeProducts.map(product => {
                    return `• <strong>${product.name}</strong> — $${Number(product.price).toFixed(2)}`;
                }).join("<br>")}
                <br><br>
                For gifts, handmade mugs, plates, and small bowls are usually the safest choices.
            `;
        }

        if (
            lowerMessage.includes("care") ||
            lowerMessage.includes("wash") ||
            lowerMessage.includes("dishwasher") ||
            lowerMessage.includes("microwave")
        ) {
            return `
                Ceramic care tips:<br><br>
                • Wash gently with mild soap.<br>
                • Avoid sudden temperature changes.<br>
                • Handmade pieces are safer with hand washing.<br>
                • If the product has gold details, avoid microwave use.
            `;
        }

        if (
            lowerMessage.includes("cart") ||
            lowerMessage.includes("checkout") ||
            lowerMessage.includes("coupon") ||
            lowerMessage.includes("invoice")
        ) {
            return `
                Guests can browse products and use the wishlist. 
                For cart, checkout, coupons, and invoice features, you will need to sign in first.
            `;
        }

        if (
            lowerMessage.includes("wishlist") ||
            lowerMessage.includes("favorite") ||
            lowerMessage.includes("heart")
        ) {
            return `
                You can add products to your wishlist by clicking the heart icon. 
                Wishlist can work even if you are browsing as a guest.
            `;
        }

        if (
            lowerMessage.includes("workshop") ||
            lowerMessage.includes("class") ||
            lowerMessage.includes("learn")
        ) {
            return `
                Our ceramic workshop idea can include hand-building, glazing, and decorating sessions. 
                Later, we can add a booking form for workshop registration.
            `;
        }

        if (
            lowerMessage.includes("shipping") ||
            lowerMessage.includes("delivery")
        ) {
            return `
                Shipping information can be added later based on your store policy. 
                For now, you can mention estimated delivery time, packaging care, and return conditions.
            `;
        }

        if (
            lowerMessage.includes("admin")
        ) {
            return `
                The admin dashboard is only for admin accounts. 
                Later, it should appear only after signing in with an admin email and password.
            `;
        }

        if (
            lowerMessage.includes("hello") ||
            lowerMessage.includes("hi") ||
            lowerMessage.includes("hey")
        ) {
            return "Hello! I’m CeramiBot. Ask me about products, ceramic care, wishlist, cart, or workshops.";
        }

        return `
            I can help with product recommendations, ceramic care, wishlist, cart rules, workshops, and store questions. 
            Try asking: <strong>“Recommend a product”</strong> or <strong>“How do I care for ceramics?”</strong>
        `;
    }

    function initCeramiBot() {
        createCeramiBot();

        const botButton = document.getElementById("ceramiBotButton");
        const botWindow = document.getElementById("ceramiBotWindow");
        const closeButton = document.getElementById("ceramiBotClose");
        const form = document.getElementById("ceramiBotForm");
        const input = document.getElementById("ceramiBotInput");
        const chips = document.querySelectorAll(".ceramibot-chip");

        loadChatHistory();

        botButton.addEventListener("click", function () {
            botWindow.classList.toggle("open");
        });

        closeButton.addEventListener("click", function () {
            botWindow.classList.remove("open");
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const userMessage = input.value.trim();

            if (!userMessage) return;

            addMessage("user", userMessage);

            input.value = "";

            setTimeout(function () {
                const reply = getBotReply(userMessage);
                addMessage("bot", reply);
            }, 400);
        });

        chips.forEach(chip => {
            chip.addEventListener("click", function () {
                const question = chip.dataset.question;

                addMessage("user", question);

                setTimeout(function () {
                    const reply = getBotReply(question);
                    addMessage("bot", reply);
                }, 400);
            });
        });
    }

    document.addEventListener("DOMContentLoaded", initCeramiBot);
})();