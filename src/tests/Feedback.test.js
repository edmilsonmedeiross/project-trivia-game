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

describe('Feedback', () => {
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
  });

  it('Testa se a página de feedback possui o nome do jogador e os pontos obtidos:', () => {
    const playerName = screen.getByTestId('header-player-name');
    const playerScore = screen.getByTestId('header-score');

    expect(playerName).toBeInTheDocument();
    expect(playerName.textContent).toBe('Tryber');
    expect(playerScore.textContent).toBe('150');
    expect(playerScore).toBeInTheDocument();
  });

  test('Testa se a página de feedback possui os botões de "play angain" e "ranking":', () => {
    const playAgainBtn = screen.getByRole('button', {
        name: /play again/i
      });
    const rankingBtn = screen.getByRole('button', {
        name: /ranking/i
      });  

    expect(playAgainBtn).toBeInTheDocument();
    expect(rankingBtn).toBeInTheDocument();
  })

  test('Testa se a página de feedback possui os botões de "play angain" e "ranking":', () => {
    const feedbackTotalScore = screen.getByTestId('feedback-total-score');
    const feedbackTotalQuestion = screen.getByTestId('feedback-total-question');

    expect(feedbackTotalScore).toBeInTheDocument();
    expect(feedbackTotalQuestion).toBeInTheDocument();
  })

  it('Testa se o a mensagem foi "Well done', () => {
    const message = screen.getByTestId('feedback-text');
    expect(message).toBeInTheDocument();
    expect(message.textContent).toBe('Well Done!');
  });

  test('Testa se o botão de "play angain" redireciona para a página de "./":', () => {
    const playAgainBtn = screen.getByRole('button', {
      name: /play again/i
    });

    userEvent.click(playAgainBtn);
    expect(history.location.pathname).toBe('/');
  })

  test('Testa se o botão de "Ranking" redireciona para a página de "./Ranking":', () => {
    const rankingBtn = screen.getByRole('button', {
      name: /ranking/i
    });

    userEvent.click(rankingBtn);
    expect(history.location.pathname).toBe('/ranking');
  })
});
