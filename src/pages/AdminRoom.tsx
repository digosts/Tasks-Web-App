import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useParams, useHistory } from "react-router-dom";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";

import logoImg from "../assets/images/logo.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";
import deleteImg from "../assets/images/delete.svg";

import "../styles/room.scss";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title } = useRoom(roomId);

  useEffect(() => {
    if (!user) {
      signInWithGoogle();
    }
  }, []);

  function handleLinkHome() {
    history.push("/");
  }

  async function handleEndRoom() {
    if (window.confirm("tem certeza que deseja encerrar essa sala?")) {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date(),
      });
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    const roomRef = await database
      .ref(`rooms/${roomId}/questions/${questionId}`)
      .get();

    const val = !roomRef.val().isHighlighted;

    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: val,
    });
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("tem certeza que deseja remover essa pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="task web" onClick={handleLinkHome} />
          <div>
            <RoomCode code={roomId} />
            {user && (
              <Button isOutlined onClick={handleEndRoom}>
                Encerrar sala
              </Button>
            )}
          </div>
        </div>
      </header>

      {user && (
        <main>
          <div className="room-title">
            <h1>{title}</h1>
            <span>{questions.length} Perguntas</span>
          </div>

          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Marcar como respondida" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Destacar pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </main>
      )}
    </div>
  );
}
