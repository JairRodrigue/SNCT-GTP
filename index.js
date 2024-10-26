import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBr3sbqQzX1LFcMShI2oFXBEfbVAGxBaN8",
    authDomain: "snct-gtp.firebaseapp.com",
    projectId: "snct-gtp",
    storageBucket: "snct-gtp.appspot.com",
    messagingSenderId: "189232867258",
    appId: "1:189232867258:web:1bb838178343a432689f83",
    measurementId: "G-R7YQRPKMP6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addTask(event) {
    event.preventDefault();

    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-description").value;
    const dueDate = document.getElementById("due-date").value;

    try {
        await addDoc(collection(db, "tasks"), {
            title: title,
            description: description,
            dueDate: dueDate,
            completed: false,
            createdAt: new Date()
        });

        alert("Tarefa adicionada com sucesso!");
        document.getElementById("task-form").reset();
        loadTasks();
    } catch (error) {
        console.error("Erro ao adicionar tarefa: ", error);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
}

async function loadTasks() {
    const pendingTasksList = document.getElementById("pending-tasks");
    const completedTasksList = document.getElementById("completed-tasks");

    pendingTasksList.innerHTML = "";
    completedTasksList.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "tasks"));

    querySnapshot.forEach((doc) => {
        const task = { id: doc.id, ...doc.data() };

        const taskElement = document.createElement("li");
        const formattedDueDate = formatDate(task.dueDate);

        taskElement.innerHTML = `<strong style="font-size: 1.1">${task.title}</strong> <br>${task.description} <br><span style="font-size: 0.9em; color: rgba(0, 0, 0, 0.6);">Prazo: ${formattedDueDate}</span>`;

        if (task.completed) {
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Excluir";
            deleteButton.onclick = () => deleteTask(task.id);
            taskElement.appendChild(deleteButton);
            completedTasksList.appendChild(taskElement);
        } else {
            const completeButton = document.createElement("button");
            completeButton.textContent = "Marcar como Concluída";
            completeButton.onclick = () => completeTask(task.id);
            taskElement.appendChild(completeButton);
            pendingTasksList.appendChild(taskElement);
        }
    });
}

async function completeTask(taskId) {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
        completed: true
    });
    loadTasks();
}

async function deleteTask(taskId) {
    const taskRef = doc(db, "tasks", taskId);
    await deleteDoc(taskRef);
    loadTasks();
}

document.getElementById("task-form").addEventListener("submit", addTask);
loadTasks();
