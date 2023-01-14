import React from 'react';
import { screen, getByTestId } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';
import Feedback from '../pages/Feedback';

describe('Testes da tela de Feedback', () => {
  test('Testa se a página de feedback possui o nome do jogador e os pontos obtidos:', () => {
    renderWithRouterAndRedux(<Feedback />);
    
    const playerName = screen.getByTestId('header-player-name');
    const playerScore = screen.getByTestId('header-score');

    expect(playerName).toBeInTheDocument();
    expect(playerScore).toBeInTheDocument();
  });

  test('Testa se a página de feedback possui os botões de "play angain" e "ranking":', () => {
    renderWithRouterAndRedux(<Feedback />);

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
    renderWithRouterAndRedux(<Feedback />);

    const feedbackTotalScore = getByTestId('feedback-total-score');
    const feedbackTotalQuestion = getByTestId('feedback-total-question');

    expect(feedbackTotalScore).toBeInTheDocument();
    expect(feedbackTotalQuestion).toBeInTheDocument();
  })

  test('Testa se o botão de "play angain" redireciona para a página de "./":', () => {
    const { history } = renderWithRouterAndRedux(<Feedback />);

    const playAgainBtn = screen.getByRole('button', {
      name: /play again/i
    });

    userEvent.click(playAgainBtn);
    expect(history.location.pathname).toBe('/');
  })

  test('Testa se o botão de "Ranking" redireciona para a página de "./Ranking":', () => {
    const { history } = renderWithRouterAndRedux(<Feedback />);

    const rankingBtn = screen.getByRole('button', {
      name: /ranking/i
    });

    userEvent.click(rankingBtn);
    expect(history.location.pathname).toBe('/ranking');
  })
});
