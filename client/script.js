// notyf

const notyf = new Notyf({
    duration: 2000, // how long to show (ms)
    position: { x: 'right', y: 'top' } // where to show
});




// server relate code 

// const serverUrl = "https://todo-backend-kunal-rathores-projects-3c5b48fa.vercel.app";
const serverUrl = "http://localhost:3000";


addEventListener("DOMContentLoaded", onLoad);

async function onLoad(event) {
    event.preventDefault();
    try {
        const isTokenAvailable = await axios({
            url: `${serverUrl}/issignedin/checktoken`,
            method: "GET",
            withCredentials: true
        });

        if (isTokenAvailable.status === 200) {
            const username = isTokenAvailable.data.username;
            loadTodo(username);
        }
    } catch (error) {
        console.log(error.message);
    }
}

function LoadsignUp() {
    const element = document.querySelector(".heroDiv_1");
    element.innerHTML = `     
      <form class="signUpForm" id="signUpForm">
        <h2 class="signUp_heading">SignUp</h2>
        <p class="signup_title">Signup now and get full access to our app</p>
        <div class="signUpinputs">
            <div class="firstlastname">
                <input type="text" placeholder="Firstname" id="firstname" required>
                <input type="text" placeholder="Lastname" id="lastname" required>
            </div>
            <input type="text" placeholder="Username" id="username" required>
            <input type="email" placeholder="Email" id="email" required>
            <input type="password" placeholder="Password" id="password" required>
            <button type="submit" class="SubmitButton">Submit</button>
        </div>
    </form>`;
    document.querySelector(".signUpForm").addEventListener("submit", signUp);
}

function LoadsignIn() {
    const element = document.querySelector(".heroDiv_1");
    element.innerHTML = `
      <form class="signInForm" id="signInForm">
        <h2 class="signIn_heading">SignIn</h2>
        <p class="signin_title">Signin and explore the functionalities</p>
        <div class="signIninputs"> <input type="email" placeholder="Email" id="email" required>
            <input type="password" placeholder="Password" id="password" required>
            <button type="submit" class="SubmitButton">Submit</button>
        </div>
    </form>
    `;
    document.querySelector(".signInForm").addEventListener("submit", signIn);
}


// signup connection
async function signUp(event) {
    event.preventDefault();

    const firstname = document.querySelector("#firstname").value;
    const lastname = document.querySelector("#lastname").value;
    const username = document.querySelector("#username").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    try {
        const signUpResponse = await axios({
            method: "POST",
            url: `${serverUrl}/sign/signup`,
            data: {
                firstname: firstname,
                lastname: lastname,
                username: username,
                email: email,
                password: password
            }
        });
        if (signUpResponse.status === 200) {
            window.location.reload();
        }
    } catch (error) {
        const allMessages = (error.response.data.message); // will be array of messages cause zod errors
        if (error.response) {
            if (error.response.status === 400 && Array.isArray(allMessages)) // zod error
            {
                // console.log(allMessages);
                allMessages.forEach((element, index) => {
                    setTimeout(() => {
                        notyf.error(element);
                    }, index * 400);           //increase time for each message by index *400ms
                });
            }
            else { notyf.error(error.response.data.message); }
        }
        else { notyf.error(error.message); }
    }
}

// signin connection
async function signIn(event) {
    event.preventDefault();
    const email = document.querySelector("#email").value, password = document.querySelector("#password").value;

    try {
        const signInResponse = await axios({
            method: "POST",
            url: `${serverUrl}/sign/signin`,
            data: { email: email, password: password },
            withCredentials: true,
        });

        if (signInResponse.status === 200) {
            window.location.reload();
        }
    } catch (error) {
        if (error.response) { // error by backend

            const message = error.response.data.message;

            if (error.response.status === 400 && Array.isArray(message)) // zod error, means error in form of array need forEach
            {
                message.forEach((message, index) => {
                    setTimeout(() => {
                        notyf.error(message);
                    }, index * 400)
                });
            }
            else {
                notyf.error(message);
            }

        } else {
            notyf.error(error.message); //network error etc.
        }
    }
}



function loadTodo(username) {

    const element = document.querySelector(".app");

    element.innerHTML = ` 
  
    <p class="usernameWithHi">
   <span class="hiBox">
      <canvas id="canvas"></canvas>
   </span>
   ${username}
</p>

    <div class="todoMain_div">

      <div class= "TodoHerocontainer"> 
        </div>
             
        <div id="addTodoDivAndLogOut">
        <h2 class="addTodo_heading">Add todo</h2>

        <form class="addTodoForm">
    
        <div class="addTodoInputs">
    
        <input type="text" placeholder="Enter title" id="title">
    
        <select name="isDone" id="isDone">
    
        <option value="true">Done</option>
    
        <option value="false">Not done</option>
    
        </select>
    
        <button class="addTodoButton" type="submit">Add Todo</button>
        </div>
        
        </form>

        <button class="logOut" onClick="logOut()">Log Out</button>
    
        </div>
    </div>     

`;

    new window.DotLottie({
        autoplay: true,
        loop: true,
        canvas: document.getElementById("canvas"),
        src: "https://lottie.host/64b7a4c6-842b-4a38-9be9-3b2cbe0bb452/DXhqu72JoL.lottie",
    });

    document.querySelector(".addTodoForm").addEventListener("submit", addTodo);
    fetchTodos();

}


async function fetchTodos() {
    try {
        const response = await axios({
            method: "GET",
            url: `${serverUrl}/todos/fetchtodos`,
            withCredentials: true
        });

        if (response.status === 200) {
            const todosContainer = document.querySelector(".TodoHerocontainer");
            todosContainer.innerHTML = "";

            const todos = response.data.todos;   // array of objects [ {},{}...]
            const groupedDates = groupTodosByDate(todos);

            // now for each todos creating seprate elements and storing in them then appending to main one
            for (const date of Object.keys(groupedDates)) {

                const dateElement = document.createElement('date');
                dateElement.classList.add("date");
                dateElement.innerText = date;
                todosContainer.appendChild(dateElement);

                groupedDates[date].forEach(todo => {

                    const li = document.createElement('li');
                    li.classList.add("todoList");

                    const todoTitle = document.createElement("p");
                    todoTitle.classList.add("todoTitle");
                    todoTitle.textContent = `${todo.title}`;

                    const doneP = document.createElement("p");
                    const done = document.createElement("button");
                    done.classList.add("doneButton");

                    if (todo.isDone) {
                        done.textContent = `Done`;
                        done.classList.add("done");
                    }
                    else {
                        done.textContent = `Not done`;
                        done.classList.add("notDone");
                    }

                    done.addEventListener("click", () => { updateTodo(todo._id) });
                    doneP.appendChild(done);

                    const deleteTodoTD = document.createElement("p");
                    deleteTodoTD.classList.add("deleteTodoTD")
                    const deleteTodo = document.createElement("button");
                    deleteTodo.textContent = `Delete todo`;
                    deleteTodo.classList.add("deleteTodoButton");
                    deleteTodoTD.appendChild(deleteTodo);

                    deleteTodo.addEventListener("click", () => { deletetodo(todo._id) }); // whenever button clicked call the delete todo function with that id

                    li.appendChild(todoTitle);
                    li.appendChild(doneP);
                    li.appendChild(deleteTodoTD);

                    dateElement.appendChild(li);
                })
            }

        }
    } catch (error) {
        if (error.response) {
            notyf.error(error.response.data.message);
        }
        else {
            notyf.error(error.message);
        }
    }
}


async function addTodo(event) {
    event.preventDefault();
    const title = document.querySelector("#title").value;
    const isDone = document.querySelector("#isDone").value;

    try {
        const response = await axios({
            method: "POST",
            url: `${serverUrl}/todos/addtodo`,
            data: { title: title, isDone: isDone },
            withCredentials: true
        });

        if (response.status === 201) {
            notyf.success(response.data.message);
            fetchTodos();
        }
    } catch (error) {
        if (error.response) {
            const messages = error.response.data.message;
            if (error.response.status === 400) // zod error need of forEach
            {
                console.log(error);
                (messages.forEach(er => notyf.error(er)));
            }
            else {
                notyf.error(messages);
            }
        }
        else {
            alert(error.message);
            notyf.error(error.message);
        }
    }
}


async function deletetodo(todoId) {
    try {
        const response = await axios({
            url: `${serverUrl}/todos/deletetodo/${todoId}`,
            method: "DELETE",
            withCredentials: true
        });

        if (response.status === 200) {
            notyf.success(response.data.message);
            fetchTodos();
        }
    } catch (error) {
        if (error.response) {
            notyf.error(error.response.data.message);  // work in both cases like invalidTodo or db fails
        }
        else {
            notyf.error(error.message); // frontend error
        }
    }


}

async function updateTodo(todoId) {

    try {
        const res = await axios({
            url: `${serverUrl}/todos/updatetodo/${todoId}`,
            withCredentials: true,
            method: "PUT",
        });
        if (res.status === 200) {
            notyf.success(res.data.message);
            fetchTodos();
        }
    } catch (error) {
        if (error.response) {
            notyf.error(error.response.data.message);
        }
        else {
            notyf.error(error.message);
        }

    }
}

async function logOut() {

    try {
        const response = await axios({
            url: `${serverUrl}/logout`,
            method: "POST",
            withCredentials: true
        });
        if (response.status === 200) {
            alert(response.data.message);
            window.location.reload();
        }
    } catch (error) {
        if (error.response) {
            alert(error.response.data.message);
        }
        else {
            alert(error.message);
        }
    }
}



function groupTodosByDate(todos) {

    const groupTodosByDate = {}

    todos.forEach(todo => {

        const dateKey = todo.date.split("T")[0];

        if (!groupTodosByDate[dateKey]) {
            groupTodosByDate[dateKey] = [];
        }
        groupTodosByDate[dateKey].push(todo);
    });
    return groupTodosByDate;

}