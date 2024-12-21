let spinsLeft = 3; // Límite de tiradas por día
let lastSpinTime = localStorage.getItem("lastSpinTime");

document.addEventListener("DOMContentLoaded", function() {
    checkDailyLimit();
    updateCountdown();
});

function checkDailyLimit() {
    const now = new Date();
    const lastSpinDate = new Date(lastSpinTime);
    const diffTime = Math.abs(now - lastSpinDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (lastSpinTime && diffDays < 1) {
        spinsLeft = 3;
    } else {
        localStorage.setItem("lastSpinTime", now);
        spinsLeft = 3;
    }
    
    updateMessage();
}

function updateMessage() {
    const message = document.getElementById("message");
    const spinButton = document.getElementById("spinButton"); // Obtener el botón
    
    if (spinsLeft > 0) {
        message.textContent = `Tienes ${spinsLeft} tiradas restantes hoy.`;
        spinButton.textContent = "Tirar"; // El texto del botón cuando aún hay intentos
        spinButton.disabled = false; // Habilitar el botón
    } else {
        message.textContent = "¡Lo siento, ya no puedes tirar más hoy!";
        spinButton.textContent = "Máximo de tiros por hoy"; // Cambiar texto cuando no hay más intentos
        spinButton.disabled = true; // Deshabilitar el botón
    }
}

function spin() {
    if (spinsLeft <= 0) return;

    spinsLeft--;
    updateMessage();

    const slot1 = document.getElementById("slot1");
    const slot2 = document.getElementById("slot2");
    const slot3 = document.getElementById("slot3");

    // Definir los emojis disponibles
    const emojis = [
        "🐼", "🐶", "🐱", "🦄", "🐻", "🐨", "🐹", "🦊", "🐯", "🦁", "🐵", "🐷", "🐸", "🐘", "🦢",
        "🦄", "🦓", "🦄", "🦆", "🦝", "🐉", "🦒", "🐴", "🦦", "🦤", "🦦", "🐧", "🐦", "🦋", "🐞",
        "🦀", "🦑", "🐍", "🦞", "🦀", "🦜", "🐙", "🦦", "🦩", "🐅", "🦑", "🦈", "🐋", "🦓", "🦀",
        "🐳", "🐟", "🐠", "🦐", "🦧", "🦢", "🦃", "🐤", "🦉", "🦜", "🦚", "🦦", "🦒", "🦛", "🦚"
    ];
    

    // Iniciar la animación de los cilindros
    let interval1, interval2, interval3;
    let count = 0;

    const animateSlot = (slot) => {
        return setInterval(() => {
            slot.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        }, 100); // Cada 100ms cambia el emoji
    };

    interval1 = animateSlot(slot1);
    interval2 = animateSlot(slot2);
    interval3 = animateSlot(slot3);

    // Detener la animación después de 4 segundos y mostrar el resultado final
    setTimeout(() => {
        clearInterval(interval1);
        clearInterval(interval2);
        clearInterval(interval3);

        // Generar resultados con probabilidades
        const result = getSpinResult(emojis);

        slot1.textContent = result[0];
        slot2.textContent = result[1];
        slot3.textContent = result[2];

        // Verificar el resultado del juego
        checkResult(result[0], result[1], result[2]);
    }, 4000); // 4 segundos de animación
}

function getSpinResult(emojis) {
    // Probabilidades:
    // 10% tres pandas
    // 20% tres iguales, pero no pandas
    // 70% no hay coincidencia
    const rand = Math.random();

    if (rand < 0.1) {
        // 10%: 3 pandas
        return ["🐼", "🐼", "🐼"];
    } else if (rand < 0.3) {
        // 20%: 3 iguales, pero no pandas
        const randomEmoji = emojis.filter(e => e !== "🐼")[Math.floor(Math.random() * (emojis.length - 1))];
        return [randomEmoji, randomEmoji, randomEmoji];
    } else {
        // 70%: no hay coincidencia
        const random1 = emojis[Math.floor(Math.random() * emojis.length)];
        const random2 = emojis[Math.floor(Math.random() * emojis.length)];
        const random3 = emojis[Math.floor(Math.random() * emojis.length)];
        return [random1, random2, random3];
    }
}

function checkResult(symbol1, symbol2, symbol3) {
    const message = document.getElementById("message");
    let recipe = "";
    let prize = "";

    if (symbol1 === symbol2 && symbol2 === symbol3) {
        if (symbol1 === "🐼") {
            prize = "Receta facilisima";
            recipe = getRecipe("nivel1"); // Nivel 1 - Fácil
        } else {
            prize = `3 ${symbol1}`;
            recipe = getRecipe("nivel2"); // Nivel 2 - Intermedio
        }
        message.textContent = `¡Felicidades! ¡Ganaste ${prize}!`;
    } else {
        prize = "Receta Dificil";
        recipe = getRecipe("nivel3"); // Nivel 3 - Difícil
        message.textContent = "Te ha tocado una recta dificil. Intenta de nuevo";
    }

    sendPrizeToDiscord(prize, recipe); // Enviar al webhook de Discord
}

function getRecipe(level) {
    const recetasNivel1 = [
        { nombre: "Tostadas con aguacate", nacionalidad: "Mexicana", ingredientes: ["Pan", "Aguacate", "Sal"] },
        { nombre: "Ensalada Caprese", nacionalidad: "Italiana", ingredientes: ["Tomate", "Mozzarella", "Albahaca", "Aceite de oliva"] },
        { nombre: "Huevos revueltos", nacionalidad: "Internacional", ingredientes: ["Huevos", "Sal", "Aceite"] },
        { nombre: "Sándwich de jamón y queso", nacionalidad: "Internacional", ingredientes: ["Pan", "Jamón", "Queso", "Mantequilla"] },
        { nombre: "Quesadilla", nacionalidad: "Mexicana", ingredientes: ["Tortilla de maíz", "Queso"] },
        { nombre: "Pan tostado con mermelada", nacionalidad: "Internacional", ingredientes: ["Pan", "Mermelada"] },
        { nombre: "Batido de plátano", nacionalidad: "Internacional", ingredientes: ["Plátano", "Leche", "Azúcar"] },
        { nombre: "Palomitas de maíz", nacionalidad: "Internacional", ingredientes: ["Maíz para palomitas", "Aceite", "Sal"] },
        { nombre: "Fruta con yogur", nacionalidad: "Internacional", ingredientes: ["Fruta al gusto", "Yogur"] },
        { nombre: "Tortilla francesa", nacionalidad: "Española", ingredientes: ["Huevos", "Sal", "Aceite"] },
        { nombre: "Arroz blanco", nacionalidad: "Internacional", ingredientes: ["Arroz", "Agua", "Sal"] },
        { nombre: "Croissant con mantequilla", nacionalidad: "Francesa", ingredientes: ["Croissant", "Mantequilla"] },
        { nombre: "Taza de café con leche", nacionalidad: "Internacional", ingredientes: ["Café", "Leche", "Azúcar"] },
        { nombre: "Té con galletas", nacionalidad: "Inglesa", ingredientes: ["Té", "Galletas"] },
        { nombre: "Pan con tomate", nacionalidad: "Española", ingredientes: ["Pan", "Tomate", "Aceite de oliva", "Sal"] },
        { nombre: "Papas fritas caseras", nacionalidad: "Internacional", ingredientes: ["Papas", "Aceite", "Sal"] },
        { nombre: "Ensalada verde", nacionalidad: "Internacional", ingredientes: ["Lechuga", "Pepino", "Aceite de oliva", "Limón", "Sal"] },
        { nombre: "Avena con leche", nacionalidad: "Internacional", ingredientes: ["Avena", "Leche", "Azúcar"] },
        { nombre: "Manzana con crema de cacahuate", nacionalidad: "Internacional", ingredientes: ["Manzana", "Crema de cacahuate"] },
        { nombre: "Gelatina de sabores", nacionalidad: "Internacional", ingredientes: ["Gelatina en polvo", "Agua"] }
    ];

    const recetasNivel2 = [
        { nombre: "Sopa de cebolla", nacionalidad: "Francesa", ingredientes: ["Cebolla", "Caldo de pollo", "Mantequilla", "Pan", "Queso Gruyere"] },
        { nombre: "Tacos al pastor", nacionalidad: "Mexicana", ingredientes: ["Carne de cerdo", "Piña", "Tortillas", "Salsa roja"] },
        { nombre: "Ratatouille", nacionalidad: "Francesa", ingredientes: ["Berenjena", "Calabacín", "Pimiento", "Tomate", "Aceite de oliva"] },
        { nombre: "Paella de mariscos", nacionalidad: "Española", ingredientes: ["Arroz", "Mariscos", "Caldo de pescado", "Azafrán", "Pimiento"] },
        { nombre: "Pollo al curry", nacionalidad: "India", ingredientes: ["Pollo", "Curry", "Leche de coco", "Cebolla", "Especias"] },
        { nombre: "Pad Thai", nacionalidad: "Tailandesa", ingredientes: ["Fideos de arroz", "Camarones", "Tofu", "Salsa de pescado", "Cacahuates"] },
        { nombre: "Pizza Margarita", nacionalidad: "Italiana", ingredientes: ["Masa de pizza", "Tomate", "Mozzarella", "Albahaca"] },
        { nombre: "Pollo Teriyaki", nacionalidad: "Japonesa", ingredientes: ["Pollo", "Salsa de soya", "Azúcar", "Jengibre", "Ajo"] },
        { nombre: "Ceviche de pescado", nacionalidad: "Peruana", ingredientes: ["Pescado blanco", "Limón", "Cilantro", "Cebolla", "Ají"] },
        { nombre: "Crema de espárragos", nacionalidad: "Internacional", ingredientes: ["Espárragos", "Crema", "Cebolla", "Caldo de pollo", "Sal"] },
        { nombre: "Burrito de carne", nacionalidad: "Mexicana", ingredientes: ["Tortilla", "Carne molida", "Frijoles", "Queso", "Salsa"] },
        { nombre: "Shakshuka", nacionalidad: "Israelí", ingredientes: ["Tomates", "Huevos", "Pimientos", "Cebolla", "Especias"] },
        { nombre: "Falafel", nacionalidad: "Mediterránea", ingredientes: ["Garbanzos", "Perejil", "Cebolla", "Ajo", "Especias"] },
        { nombre: "Gnocchi con salsa de tomate", nacionalidad: "Italiana", ingredientes: ["Gnocchi", "Tomate", "Ajo", "Aceite de oliva", "Queso parmesano"] },
        { nombre: "Empanadas de carne", nacionalidad: "Argentina", ingredientes: ["Carne molida", "Masa de empanada", "Cebolla", "Huevo duro", "Especias"] },
        { nombre: "Chow Mein", nacionalidad: "China", ingredientes: ["Fideos", "Pollo", "Verduras", "Salsa de soya", "Jengibre"] },
        { nombre: "Risotto de hongos", nacionalidad: "Italiana", ingredientes: ["Arroz arborio", "Champiñones", "Caldo", "Mantequilla", "Parmésano"] },
        { nombre: "Arepas rellenas", nacionalidad: "Venezolana", ingredientes: ["Harina de maíz", "Queso", "Pollo", "Aguacate", "Mantequilla"] },
        { nombre: "Bacalao a la vizcaína", nacionalidad: "Española", ingredientes: ["Bacalao", "Pimientos rojos", "Cebolla", "Tomate", "Aceite de oliva"] },
        { nombre: "Croquetas de jamón", nacionalidad: "Española", ingredientes: ["Jamón serrano", "Bechamel", "Pan rallado", "Huevo", "Aceite"] }
    ];

    const recetasNivel3 = [
        { nombre: "Paella Valenciana", nacionalidad: "Española", ingredientes: ["Arroz", "Azafrán", "Mariscos", "Pollo", "Verduras"] },
        { nombre: "Sushi", nacionalidad: "Japonesa", ingredientes: ["Arroz", "Algas Nori", "Pescado fresco", "Vinagre de arroz"] },
        { nombre: "Moussaka", nacionalidad: "Griega", ingredientes: ["Carne de cordero", "Berenjenas", "Salsa bechamel", "Queso rallado"] },
        { nombre: "Ramen", nacionalidad: "Japonesa", ingredientes: ["Fideos", "Caldo de cerdo", "Huevo cocido", "Algas", "Cebollín"] },
        { nombre: "Lasaña", nacionalidad: "Italiana", ingredientes: ["Pasta", "Carne molida", "Salsa bechamel", "Queso ricotta", "Espinacas"] },
        { nombre: "Tacos al pastor", nacionalidad: "Mexicana", ingredientes: ["Carne de cerdo", "Piña", "Tortillas", "Salsa", "Cebolla"] },
        { nombre: "Tajine de cordero", nacionalidad: "Marroquí", ingredientes: ["Cordero", "Ciruelas", "Almendras", "Especias", "Garbanzos"] },
        { nombre: "Peking Duck", nacionalidad: "China", ingredientes: ["Pato", "Salsa hoisin", "Pancakes de arroz", "Pepino", "Cebollines"] },
        { nombre: "Ceviche", nacionalidad: "Peruana", ingredientes: ["Pescado fresco", "Limón", "Cebolla morada", "Cilantro", "Ají"] },
        { nombre: "Boeuf Bourguignon", nacionalidad: "Francesa", ingredientes: ["Carne de res", "Vino tinto", "Champiñones", "Zanahorias", "Cebollas"] },
        { nombre: "Churrasco", nacionalidad: "Argentina", ingredientes: ["Carne de res", "Sal", "Pimienta", "Aceite de oliva", "Ajo"] },
        { nombre: "Pho", nacionalidad: "Vietnamita", ingredientes: ["Fideos", "Caldo de carne", "Hierbas frescas", "Carne de res", "Brotes de soja"] },
        { nombre: "Kebab", nacionalidad: "Turca", ingredientes: ["Carne de cordero", "Especias", "Pan pita", "Yogur", "Verduras"] },
        { nombre: "Haggis", nacionalidad: "Escocesa", ingredientes: ["Carne de oveja", "Avena", "Especias", "Caldo", "Cebollas"] },
        { nombre: "Goulash", nacionalidad: "Húngara", ingredientes: ["Carne de res", "Pimentón", "Paprika", "Patatas", "Cebollas"] },
        { nombre: "Sauerbraten", nacionalidad: "Alemana", ingredientes: ["Carne de res", "Vinagre", "Azúcar", "Especias", "Zanahorias"] },
        { nombre: "Bacalhau à Brás", nacionalidad: "Portuguesa", ingredientes: ["Bacalao", "Patatas", "Huevos", "Cebolla", "Aceitunas"] },
        { nombre: "Dim Sum", nacionalidad: "China", ingredientes: ["Harina", "Carne de cerdo", "Camarones", "Verduras", "Salsa de soja"] },
        { nombre: "Curry Massaman", nacionalidad: "Tailandesa", ingredientes: ["Carne de pollo", "Leche de coco", "Papas", "Anacardos", "Especias"] },
        { nombre: "Biryani", nacionalidad: "India", ingredientes: ["Arroz basmati", "Pollo", "Yogur", "Especias", "Pasas"] },
        { nombre: "Chili con carne", nacionalidad: "Americana", ingredientes: ["Carne molida", "Frijoles", "Tomates", "Chile", "Cebolla"] }
    ];

    switch (level) {
        case "nivel1":
            return recetasNivel1[Math.floor(Math.random() * recetasNivel1.length)];
        case "nivel2":
            return recetasNivel2[Math.floor(Math.random() * recetasNivel2.length)];
        case "nivel3":
            return recetasNivel3[Math.floor(Math.random() * recetasNivel3.length)];
        default:
            return recetasNivel3[Math.floor(Math.random() * recetasNivel3.length)];
    }
}
function sendPrizeToDiscord(prize, recipe) {
    const webhookUrl = 'https://discord.com/api/webhooks/1320140875644407829/pnPYkldH1huvMl5c1a4yMq9qnpAdHNnMpBAobHfPJL6lQ-X4sG70S0lMgVUkuF3HHdIq'; // Reemplaza con tu URL del webhook de Discord
    const now = new Date();
    const dateTime = now.toLocaleString(); // Obtiene la fecha y hora actual

    const payload = {
        content: `🎉 ¡Receta nueva! 🎉\n\n## ${prize}\n\nReceta: ${recipe.nombre}\nDificultad: ${recipe.dificultad}\nNacionalidad: ${recipe.nacionalidad}\nIngredientes:\n- ${recipe.ingredientes.join("\n- ")}\n\nFecha y hora de envío: ${dateTime}\n\n||@here @everyone||`
    };

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

function updateCountdown() {
    const now = new Date();
    const lastSpinDate = new Date(lastSpinTime);
    const diffTime = Math.abs(now - lastSpinDate);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

    const countdown = document.getElementById("countdown");
    countdown.textContent = `Tiempo hasta la siguiente tirada: ${24 - diffHours} horas y ${60 - diffMinutes} minutos.`;
}
