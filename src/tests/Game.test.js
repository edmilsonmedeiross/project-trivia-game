import React from "react";
import {
  getByTestId,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App from "../App";
import { renderWithRouterAndRedux } from "./helpers/renderWithRouterAndRedux";
import userEvent from "@testing-library/user-event";
import Game from "../pages/Game";
import Login from "../pages/Login";


const mockResponse = {
  response_code: 0,
  results: [
    {
      category: "History",
      type: "multiple",
      difficulty: "hard",
      question: "List the following Iranic empires in chronological order:",
      correct_answer: "Median, Achaemenid, Parthian, Sassanid",
      incorrect_answers: [
        "Median, Achaemenid, Sassanid, Parthian",
        "Achaemenid, Median, Parthian, Sassanid",
        "Achaemenid, Median, Sassanid, Parthian",
      ],
    },
  ],
};
const errorResponse = {
  response_code: 3,
};

describe("Testes de cobertura da tela de Jogo", () => {
  let history;
  let store;
  beforeEach(() => {
    jest.spyOn(global, "fetch");
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });
    const component = renderWithRouterAndRedux(<App />);
    history = component.history;
    store = component.store;
    const playerName = screen.getByTestId("input-player-name");
    const playButton = screen.getByRole("button", { name: "Play" });
    userEvent.type(playerName, "Tryber");
    const emailInput = screen.getByTestId("input-gravatar-email");
    userEvent.type(emailInput, "tryber@trybe.com");
    userEvent.click(playButton);
  });
  it("Verifica se com o código de response errado, retorna a tela inicial", async () => {
    jest.spyOn(global, "fetch");
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(errorResponse),
    });
    await waitFor(() => {
      expect(history.location.pathname).toBe("/");
    });
  });
  it("Verifica introdução da página", () => {
    const logoGame = screen.getByAltText(/logo/);
    const yourTurn = screen.getByText(/sua vez/i);

    expect(logoGame).toBeInTheDocument();
    expect(yourTurn).toBeInTheDocument();
  });
  it("Página contém informações relacionadas à pergunta", async () => {
    const questionCategory = await screen.findByTestId("question-category");
    expect(questionCategory).toBeInTheDocument();
  });
  it("Página contém informações da pessoa jogadora", () => {
    const inputName = screen.getByTestId("input-player-name");
    const inputEmail = screen.getByTestId("input-gravatar-email");
    const playButton = screen.getByTestId("btn-play");

    userEvent.click(inputName);
    userEvent.type(inputName, "Tryber");
    userEvent.click(inputEmail);
    userEvent.type(inputEmail, "trybe@hotmail.com");
    userEvent.click(playButton);

    const playerName = screen.getByTestId("header-player-name");
    const scoreboard = screen.getByTestId("header-score");
    const imgAvatar = screen.getByTestId("header-profile-picture");

    expect(playerName).toBeInTheDocument();
    expect(scoreboard).toBeInTheDocument();
    expect(imgAvatar).toBeInTheDocument();
  });
  it("Ao clicar na resposta correta, o botão fica verde.", async () => {
    renderWithRouterAndRedux(<Game />);
    expect(history.location.pathname).toBe("/game");
    const correctAnswer = await screen.findByTestId("correct-answer");
    userEvent.click(correctAnswer);
    expect(correctAnswer).toHaveClass("green");
  });
  it("Ao clicar na resposta incorreta, os botões ficam vermelhos.", async () => {    
    expect(history.location.pathname).toBe("/game");
    const correctAnswer = await screen.findByTestId("correct-answer");
    const wrongAnswer = await screen.findByTestId("wrong-answer-10");
    userEvent.click(correctAnswer);
    //console.log('wrongAnswer',wrongAnswer)
    expect(wrongAnswer).toHaveClass("red");
  });
  it("Score é atualizado ao clicar na resposta correta", async () => {
    const correctAnswer = await screen.findByTestId("correct-answer");
    userEvent.click(correctAnswer);
    const scoreboard = await screen.findByTestId("header-score");
    expect(scoreboard).toHaveTextContent("40");
  });
  it("Botão de próxima pergunta aparece ao clicar na resposta errada", async () => {
    expect(history.location.pathname).toBe("/game");
    const wrongAnswer = await screen.findByTestId("wrong-answer-27");

    userEvent.click(wrongAnswer);
    const nextButton = await screen.findByTestId("btn-next");
    expect(nextButton).toBeInTheDocument();
  });
  /* it("Próxima pergunta é exibida ao clicar no botão next e o score atualiza corretamente e direciona para a página de feedbacks", async () => {
    expect(history.location.pathname).toBe("/game");
    const correctAnswer = await screen.findByTestId("correct-answer");
    const currentQuestion = screen.getByTestId("current-question");

    expect(currentQuestion).toHaveTextContent("1");
    userEvent.click(correctAnswer);

    const nextButton = await screen.findByTestId("btn-next");
    userEvent.click(nextButton);

    const newQuestion = await screen.findByTestId("question-text");
    expect(currentQuestion).toHaveTextContent("2");
    expect(newQuestion).toHaveTextContent(
      "What is the fifth largest country by area?"
    );

    const score = await screen.findByTestId("header-score");
    expect(score).toHaveTextContent("120");

    const feedbackText = await screen.findByTestId("feedback-text");
    expect(feedbackText).toBeInTheDocument();

    await waitFor(() => expect(feedbackText).toHaveBeenCalled());
  }); */
  it("Verifica se a página contém timer", async () => {
    await waitFor(() => {
      screen.getByTestId("correct-answer");
      expect();
    });
    const timer = screen.getByTestId("timer");
    expect(timer).toHaveTextContent("30");
    await waitFor(
      () => {
        expect(timer).toHaveTextContent("29");
      },
      { timeout: 10000 }
    );
  });
  it('Verifica se os botões são disabilitados ao finalizar o tempo', async () => {
        const countdown = 32000;
        await waitFor(() => {
            screen.getByTestId('correct-answer');
        }, { timeout: 10000 })
        const currentScore = screen.getByTestId('header-score');
        expect(currentScore).toHaveTextContent('0');
        const timer = screen.getByTestId('timer')
        expect(timer).toBeInTheDocument()       
        await waitFor(() => {
            expect(timer.textContent).toBe('0'); 
        }, { timeout: countdown})
        const correctAnswer = screen.getByTestId('correct-answer')
        expect(correctAnswer).toBeInTheDocument()
        await waitFor(() => {
            expect(correctAnswer).toBeDisabled()
        }, { timeout: 10000})
        expect(currentScore).toHaveTextContent('0')
    }, 60000)    
});
