import React from 'react';
import {
    cleanup,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App from "../App";
import { renderWithRouterAndRedux } from "./helpers/renderWithRouterAndRedux";
import userEvent from "@testing-library/user-event";

const mockResponse = {
  response_code: 0,
  results: [
    {
      category: "History",
      type: "multiple",
      difficulty: "hard",
      question: 'What is the capital of France?',
      correct_answer: 'Paris',
      incorrect_answers: ['London', 'Rome', 'Madrid']
    },
    {
      category: "Science",
      type: "boolean",
      difficulty: "easy",
      question: "Is the earth round?",
      correct_answer: "True",
      incorrect_answers: ["False"]
    },
    {
      category: "Geography",
      type: "multiple",
      difficulty: "medium",
      question: "Which of the following countries is not located in Europe?",
      correct_answer: "Morocco",
      incorrect_answers: ["Germany", "Spain", "France"]
    },
    {
      category: "Entertainment",
      type: "multiple",
      difficulty: "hard",
      question: "Which of the following actors won an Academy Award for their role in The Godfather?",
      correct_answer: "Marlon Brando",
      incorrect_answers: ["Al Pacino", "James Caan", "Robert Duvall"]
    },
    {
      category: "Sports",
      type: "multiple",
      difficulty: "easy",
      question: "Which of the following sports is not played on ice?",
      correct_answer: "Soccer",
      incorrect_answers: ["Hockey", "Curling", "Speed skating"]
    }
  ],
};

const errorCode = {
  response_code: 3,
};

const spyFetch = jest.spyOn(global, "fetch");

describe('Game', () => {
  let history;
  beforeEach(() => {
    spyFetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });
    const component = renderWithRouterAndRedux(<App />);
    history = component.history;
    const playerName = screen.getByTestId("input-player-name");
    const playButton = screen.getByRole("button", { name: "Play" });
    userEvent.type(playerName, "Tryber");
    const emailInput = screen.getByTestId("input-gravatar-email");
    userEvent.type(emailInput, "tryber@trybe.com");
    userEvent.click(playButton);
  });

  it("Verifica se com o código de response errado, retorna a tela inicial", async () => {
    spyFetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(errorCode),
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
    const playerName = screen.getByRole("heading", { name: "Tryber" });
    const playerScore = screen.getByTestId("header-score");
    const gravatarImage = screen.getByAltText("player avatar");

    expect(playerName).toBeInTheDocument();
    expect(playerScore).toBeInTheDocument();
    expect(gravatarImage).toBeInTheDocument();
  });

  it("Verifica se a pergunta é renderizada na tela", async () => {
    const question = await screen.findByTestId("question-text");
    console.log(question)
    expect(question).toBeInTheDocument();
  }); 

  it("Verifica se as alternativas são renderizadas na tela", async () => {
    const correctAnswer = await screen.findByTestId("correct-answer");
    const incorrectAnswer1 = await screen.findByTestId("wrong-answer-0");
    const incorrectAnswer2 = await screen.findByTestId("wrong-answer-1");
    const incorrectAnswer3 = await screen.findByTestId("wrong-answer-2");

    expect(correctAnswer).toBeInTheDocument();
    expect(incorrectAnswer1).toBeInTheDocument();
    expect(incorrectAnswer2).toBeInTheDocument();
    expect(incorrectAnswer3).toBeInTheDocument();
  });

  it("Verifica se o botão de próxima pergunta é renderizado na tela", async () => {
    userEvent.click(await screen.findByTestId("correct-answer"));

    const nextButton = await screen.findByTestId("btn-next");
    expect(nextButton).toBeInTheDocument();
  });

  it("Verifica se tem timer na pagina", async () => {
    const timer = await screen.findByTestId("timer");
    expect(timer).toHaveTextContent("30");
  });

  it("Verifica se tem timer esta contando", async () => {
    const timer = await screen.findByTestId("timer");
    expect(timer).toHaveTextContent("30");

    await waitFor(() => {
      expect(timer).toHaveTextContent("27");
    }, { timeout: 4000 });  
  });

  it('Verifica se os botões são desabilitados ao finalizar o tempo', async () => {
    await waitFor(() => {
        screen.getByTestId('correct-answer');
    }, { timeout: 3000 })
    
    const startNextButton = screen.queryByTestId("btn-next");
    expect(startNextButton).not.toBeInTheDocument();

    const timer = screen.getByTestId('timer')
    expect(timer).toBeInTheDocument()       

    await waitFor(() => {
      expect(timer.textContent).toBe('0'); 
    }, { timeout: 32000 })

    const correctAnswer = screen.getByTestId('correct-answer')
    const incorrectAnswer1 = await screen.findByTestId("wrong-answer-114");
    const incorrectAnswer2 = await screen.findByTestId("wrong-answer-115");
    const incorrectAnswer3 = await screen.findByTestId("wrong-answer-116");

    expect(correctAnswer).toBeInTheDocument()
    expect(incorrectAnswer1).toBeInTheDocument();
    expect(incorrectAnswer2).toBeInTheDocument();
    expect(incorrectAnswer3).toBeInTheDocument();

    const currentScore = screen.getByTestId('header-score');

    await waitFor(() => {
      expect(correctAnswer).toBeDisabled()
      expect(incorrectAnswer1).toBeDisabled();
      expect(incorrectAnswer2).toBeDisabled();
      expect(incorrectAnswer3).toBeDisabled();
      expect(currentScore).toHaveTextContent('0');
    }, { timeout: 3000})

    const nextButton = await screen.findByTestId("btn-next");
    expect(nextButton).toBeInTheDocument();
  }, 35000)    

  it("Verifica se as proximas 5  perguntas sao renderizadas", async () => {
    userEvent.click(await screen.findByTestId("correct-answer"));
    userEvent.click(await screen.findByTestId("btn-next"));
    const secondQuestion = await screen.findByTestId("question-text");
    expect(secondQuestion.textContent).toBe(mockResponse.results[1].question);

    userEvent.click(await screen.findByTestId("correct-answer"));
    userEvent.click(await screen.findByTestId("btn-next"));
    const thirdQuestion = await screen.findByTestId("question-text");
    expect(thirdQuestion.textContent).toBe(mockResponse.results[2].question);

    userEvent.click(await screen.findByTestId("correct-answer"));
    userEvent.click(await screen.findByTestId("btn-next"));
    const fourthQuestion = await screen.findByTestId("question-text");
    expect(fourthQuestion.textContent).toBe(mockResponse.results[3].question);

    userEvent.click(await screen.findByTestId("correct-answer"));
    userEvent.click(await screen.findByTestId("btn-next"));
    const fifthQuestion = await screen.findByTestId("question-text");
    expect(fifthQuestion.textContent).toBe(mockResponse.results[4].question);
  });

  it("Verifica se apos as 5 perguntas, vai para a tela de feedback", async () => {
    userEvent.click(await screen.findByTestId("correct-answer"));
    userEvent.click(await screen.findByTestId("btn-next"));
    const secondQuestion = await screen.findByTestId("question-text");
    expect(secondQuestion.textContent).toBe(mockResponse.results[1].question);

    userEvent.click(await screen.findByTestId("correct-answer"));
    userEvent.click(await screen.findByTestId("btn-next"));
    const thirdQuestion = await screen.findByTestId("question-text");
    expect(thirdQuestion.textContent).toBe(mockResponse.results[2].question);

    userEvent.click(await screen.findByTestId("correct-answer"));
    userEvent.click(await screen.findByTestId("btn-next"));
    const fourthQuestion = await screen.findByTestId("question-text");
    expect(fourthQuestion.textContent).toBe(mockResponse.results[3].question);

    userEvent.click(await screen.findByTestId("correct-answer"));
    userEvent.click(await screen.findByTestId("btn-next"));
    const fifthQuestion = await screen.findByTestId("question-text");
    expect(fifthQuestion.textContent).toBe(mockResponse.results[4].question);

    userEvent.click(await screen.findByTestId("correct-answer"));
    userEvent.click(await screen.findByTestId("btn-next"));

    await waitFor(() => {
      expect(history.location.pathname).toBe("/feedback");
    }, {timeout: 1000});
  });
});
