import { useState } from "react";

export default function RegisterPage(){
    const [username,setusername]=useState('');
    const [password,setpassword]=useState('');
     async function register(ev){
    ev.preventDefault();
    await fetch('http://localhost:4000',{method:'POST',
        body : JSON.stringify({username,password}),
        headers: {'content-Type':'application/json'},
      } )

    }
    return(
       <form className="register" onSubmit={register}>
        <h1>Register</h1>
        <input type="text"
         placeholder="username"
          value={username}
           onChange={ev=>setusername(ev.target.value)}/>
        <input type="password"
         placeholder="password"
         value={password}
         onChange={ev=>setpassword(ev.target.value)}/>
        <button>Register</button>
       </form>
    );
}