import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';
import App from '../App';

const mockToken = {
    token: 'ab98a9va8e9a8f9ae'
}

describe('Testes da tela de Login', () => {

    test('Testa se a tela de login possui inputs para nome e email do usuário:', () => {
        renderWithRouterAndRedux(<App />);
        const name = screen.getByTestId('input-player-name');
        const email = screen.getByTestId('input-gravatar-email');

        expect(name).toBeInTheDocument();
        expect(email).toBeInTheDocument();
    });

    test('Testa se a tela de login possui os botões play e configurações:', () => {
        renderWithRouterAndRedux(<App />);
        const playBtn = screen.getByRole('button', {
            name: /play/i
          });
        const settingsBtn = screen.getByRole('button', {
            name: /configurações/i
          });  

        expect(playBtn).toBeInTheDocument();
        expect(settingsBtn).toBeInTheDocument();
    });

    test('Testa se o botão play esta desativado quando os inputs de nome e email estiveram vazios:', () => {
      renderWithRouterAndRedux(<App />);
      const playBtn = screen.getByRole('button', {
          name: /play/i
        });

      expect(playBtn).toBeDisabled();
    });

    test('Testa se o botão play é ativado ao preencher os inputs', () => {
      renderWithRouterAndRedux(<App />);
      const name = screen.getByTestId('input-player-name');
      const email = screen.getByTestId('input-gravatar-email'); 
      const playBtn = screen.getByRole('button', {
        name: /play/i
      });

      userEvent.type(email, 'test@test.com');
      expect(playBtn).toBeDisabled();

      userEvent.type(name, 'Test');
      userEvent.clear(email);
      expect(playBtn).toBeDisabled();

      userEvent.type(email, 'test@test.com')
      expect(playBtn).toBeEnabled();
    })

    test('Testa se o botão play redireciona para a página "/game" e chama a função fetch', () => {
      jest.spyOn(global, 'fetch')
      global.fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockToken)
      })
      const { history } = renderWithRouterAndRedux(<App />);
      const name = screen.getByTestId('input-player-name');
      const email = screen.getByTestId('input-gravatar-email'); 
      const playBtn = screen.getByRole('button', {
        name: /play/i
      });

      userEvent.type(name, 'Test');
      userEvent.type(email, 'test@test.com');
      userEvent.click(playBtn);
      expect(global.fetch).toHaveBeenCalled();
      waitFor(() => {
        expect(history.location.pathname).toBe('/game');
      });
    })

    test('Testa se o botão de configurações para a página "/settings"', () => {
      const { history } = renderWithRouterAndRedux(<App />);
      const settingsBtn = screen.getByRole('button', {
        name: /configurações/i
      }); 

      userEvent.click(settingsBtn);
      expect(history.location.pathname).toBe('/settings');
    })
});
