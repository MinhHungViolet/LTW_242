import { useState, useEffect } from "react";

const Home = () => {
    const [username, setUsername] = useState("");
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);
    return (
        <div>
            Check var:
            {username}
        </div>
    );
}

export default Home