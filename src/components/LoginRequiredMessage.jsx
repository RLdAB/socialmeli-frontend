import { useNavigate } from "react-router-dom";

export default function LoginRequiredMessage() {
    const navigate = useNavigate();

    return (
        <div style={{ padding: 16}}>
            <p><strong>É necessário você realizar o login</strong></p>
            <button onClick={() => navigate("/login")}>Ir para login</button>
        </div>
    );
}