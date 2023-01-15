
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';
import App from '../App';

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

const spyFetch = jest.spyOn(global, "fetch");

describe('Ranking', () => {
  let history;
  beforeEach(async () => {
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
    
    const rankingButton = await screen.findByRole("button", { name: /ranking/i });
    userEvent.click(rankingButton);
  });

  it('1- Deve estar na pagina de ranking com o nome "Tryber" e 150 pontos', () => {
    const rankingTitle = screen.getByRole("heading", { name: /ranking/i });
    const playerName = screen.getByTestId("player-name-0");
    const playerScore = screen.getByTestId("player-score-0");

    expect(playerName).toBeInTheDocument();
    expect(playerName.textContent).toBe("Tryber");
    expect(playerScore).toBeInTheDocument();
    expect(playerScore.textContent).toBe("150");
    expect(rankingTitle).toBeInTheDocument();
  });

  it('2- Deve ir para a pagina inicial quando clicar no botão "Voltar para o inicio"', () => {
    const playAgainButton = screen.getByRole("button", { name: /voltar para o inicio/i });
    userEvent.click(playAgainButton);
    expect(history.location.pathname).toBe("/");
  });

  it('3- Testa se um segundo jogador é adicionado ao ranking', async () => {
    const playAgainButton = screen.getByRole("button", { name: /voltar para o inicio/i });
    userEvent.click(playAgainButton);

    const playerName = screen.getByTestId("input-player-name");
    const playButton = screen.getByRole("button", { name: "Play" });
    userEvent.type(playerName, "Teste");
    const emailInput = screen.getByTestId("input-gravatar-email");
    userEvent.type(emailInput, "teste@gmail.com");
    userEvent.click(playButton);

    userEvent.click(await screen.findByTestId("wrong-answer-159"));
    userEvent.click(await screen.findByTestId("btn-next"));

    userEvent.click(await screen.findByTestId("correct-answer"));
    userEvent.click(await screen.findByTestId("btn-next"));

    userEvent.click(await screen.findByTestId("correct-answer"));
    userEvent.click(await screen.findByTestId("btn-next"));

    userEvent.click(await screen.findByTestId("correct-answer"));
    userEvent.click(await screen.findByTestId("btn-next"));

    userEvent.click(await screen.findByTestId("correct-answer"));
    userEvent.click(await screen.findByTestId("btn-next"));

    const rankingButton = await screen.findByRole("button", { name: /ranking/i });
    userEvent.click(rankingButton);

    expect(history.location.pathname).toBe("/ranking");

    const playerName1 = screen.getByTestId("player-name-0");
    const playerScore1 = screen.getByTestId("player-score-0");
    const playerName2 = screen.getByTestId("player-name-3");
    const playerScore2 = screen.getByTestId("player-score-3");

    expect(playerName1).toBeInTheDocument();
    expect(playerName1.textContent).toBe("Tryber");
    expect(playerScore1).toBeInTheDocument();
    expect(playerScore1.textContent).toBe("150");
    expect(playerName2).toBeInTheDocument();
    expect(playerName2.textContent).toBe("Teste");
    expect(playerScore2).toBeInTheDocument();
    expect(playerScore2.textContent).toBe("110");
  });
});
