import { useHistory } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/pesquisa.svg';
import '../styles/auth.scss';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import React, { FormEvent, useState } from 'react';
import Switch from 'react-switch';
import { database } from '../services/firebase';
import { useTheme } from '../hooks/usePersistedState';


export function Home() {
    const history = useHistory();
    const { persona, signInWithGoogle } = useAuth();
    const { theme, toogleTheme } = useTheme();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom() {
        if (!persona) {
            await signInWithGoogle()
        }

        history.push('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();
        if (roomCode.trim() === '') {
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();
        if (!roomRef.exists()) {
            alert('Sala não existe.');
            return;
        }

        history.push(`/rooms/${roomCode}`);
    }

    return (
        <div id="page-auth" className={theme}>
            <aside>
                <img src={illustrationImg} alt="ilustração" />
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
                <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
            </aside>
            <main>
                <div className="main-content">
                    <div>
                        <Switch
                            onChange={toogleTheme}
                            checked={theme === 'Dark'}
                            checkedIcon={false}
                            uncheckedIcon={false}
                            onColor="#000000"
                        />
                    </div>
                    <img src={logoImg} alt="LetMeAsk" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo do Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">
                        ou entre em uma sala
                    </div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            <FiLogIn />
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}