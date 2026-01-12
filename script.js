alert("-¡Soy un joven de 17 años que sueña con ser programador, espero os guste!")
alert("-I'm a 17-year-old who dreams of becoming a programmer, I hope you like it!")
alert("-أنا شاب أبلغ من العمر 17 عامًا وأحلم بأن أصبح مبرمجًا، أتمنى أن يعجبكم هذا!")
alert("-Je suis un garçon de 17 ans et je rêve de devenir programmeur, j'espère que ça vous plaira !")
alert("-Sou um rapaz de 17 anos e sonho ser programador. Espero que gostem!")
alert("-Мне 17 лет, и я мечтаю стать программистом. Надеюсь, вам понравится!")
alert("-我是一名17岁的少年，梦想成为一名程序员，希望你们喜欢！")
alert("-मैं एक 17 वर्षीय लड़का हूँ जो प्रोग्रामर बनने का सपना देखता है, आशा है आपको यह पसंद आएगा!")
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const languageSelect = document.getElementById("languageSelect");

const pendientesList = document.getElementById("pendientesList");
const enprogresoList = document.getElementById("enprogresoList");
const completadasList = document.getElementById("completadasList");

let tasks = [];
let taskId = 0;

// Traducciones principales
const translations = {
    es: { title: "Mi Gestor De Tareas", placeholder:"Nueva tarea", add:"Añadir", pendientes:"Pendientes", enprogreso:"Echo", completadas:"Echo" },
    en: { title:"My Task Manager", placeholder:"New task", add:"Add", pendientes:"To Do", enprogreso:"Doing", completadas:"Done" },
    zh: { title:"我的任务管理器", placeholder:"新任务", add:"添加", pendientes:"待办", enprogreso:"进行中", completadas:"已完成" },
    ar: { title:"مدير المهام الخاص بي", placeholder:"مهمة جديدة", add:"إضافة", pendientes:"مهام", enprogreso:"قيد التنفيذ", completadas:"تم" },
    fr: { title:"Mon Gestionnaire de Tâches", placeholder:"Nouvelle tâche", add:"Ajouter", pendientes:"À faire", enprogreso:"En cours", completadas:"Fait" },
    ru: { title:"Мой Менеджер Задач", placeholder:"Новая задача", add:"Добавить", pendientes:"Сделать", enprogreso:"В процессе", completadas:"Сделано" },
    pt: { title:"Meu Gerenciador de Tarefas", placeholder:"Nova tarefa", add:"Adicionar", pendientes:"A Fazer", enprogreso:"Fazendo", completadas:"Feito" },
    hi: { title:"मेरा कार्य प्रबंधक", placeholder:"नया कार्य", add:"जोड़ें", pendientes:"करने के लिए", enprogreso:"चल रहा है", completadas:"पूर्ण" }
};

// Cambiar idioma
function setLanguage(lang) {
    const t = translations[lang];
    document.querySelector("h1").textContent = t.title;
    document.getElementById("taskInput").placeholder = t.placeholder;
    document.querySelector("#taskForm button").textContent = t.add;
    document.querySelector("#pendientes h2").textContent = t.pendientes;
    document.querySelector("#enprogreso h2").textContent = t.enprogreso;
    document.querySelector("#completadas h2").textContent = t.completadas;
}
languageSelect.addEventListener("change", e => setLanguage(e.target.value));

// Añadir tarea
form.addEventListener("submit", e => {
    e.preventDefault();
    const text = input.value.trim();
    if(!text) return;
    const taskObj = { id: taskId++, text, status:"pendientes" };
    tasks.push(taskObj);
    input.value = "";
    renderTasks();
});

// Renderizar tareas con animación FLIP
function renderTasks() {
    const lists = [pendientesList, enprogresoList, completadasList];
    const previousPositions = new Map();

    document.querySelectorAll("li").forEach(li => {
        previousPositions.set(li.dataset.id, li.getBoundingClientRect());
    });

    pendientesList.innerHTML = "";
    enprogresoList.innerHTML = "";
    completadasList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.text;
        li.setAttribute("draggable", true);
        li.dataset.id = task.id;

        const btnDelete = document.createElement("button");
        btnDelete.textContent = "X";
        btnDelete.onclick = () => { tasks = tasks.filter(t=>t.id!==task.id); renderTasks(); };
        li.appendChild(btnDelete);

        li.addEventListener("dragstart", ()=>li.classList.add("dragging"));
        li.addEventListener("dragend", ()=>li.classList.remove("dragging"));

        if(task.status==="pendientes") pendientesList.appendChild(li);
        if(task.status==="enprogreso") enprogresoList.appendChild(li);
        if(task.status==="completadas") completadasList.appendChild(li);

        // Animación FLIP
        const oldPos = previousPositions.get(String(task.id));
        if(oldPos){
            const newPos = li.getBoundingClientRect();
            const deltaX = oldPos.left - newPos.left;
            const deltaY = oldPos.top - newPos.top;
            li.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            requestAnimationFrame(()=>{
                li.style.transition = "transform 0.3s ease";
                li.style.transform = "";
            });
            li.addEventListener('transitionend', ()=>{
                li.style.transition = "";
            }, { once: true });
        }
    });
}

// Drag & Drop
document.querySelectorAll(".dropzone").forEach(zone=>{
    zone.addEventListener("dragover", e=>{ e.preventDefault(); zone.classList.add("dragover"); });
    zone.addEventListener("dragleave", ()=>zone.classList.remove("dragover"));
    zone.addEventListener("drop", e=>{
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        const id = Number(dragging.dataset.id);
        const task = tasks.find(t=>t.id===id);
        if(zone.id==="pendientesList") task.status="pendientes";
        if(zone.id==="enprogresoList") task.status="enprogreso";
        if(zone.id==="completadasList") task.status="completadas";
        renderTasks();
        zone.classList.remove("dragover");
    });
});