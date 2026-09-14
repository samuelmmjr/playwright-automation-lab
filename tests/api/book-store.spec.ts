import { test, expect } from '@playwright/test';

import {
  AddBooksResponse,
  BooksResponse,
  CreateUserResponse,
  GenerateTokenResponse,
  UserResponse,
} from '../../utils/api-types';

test.describe('Book Store API', () => {
  test('deve criar usuário, adicionar livros, validar coleção e remover usuário', async ({
    request,
  }) => {
    const username = `qa_${Date.now()}`;
    const password = 'QaLab123!';

    let userId = '';
    let token = '';
    let selectedIsbns: string[] = [];

    await test.step('Criar usuário', async () => {
      const response = await request.post('/Account/v1/User', {
        data: {
          userName: username,
          password,
        },
      });

      expect(response.status()).toBe(201);

      const body = (await response.json()) as CreateUserResponse;

      expect(body.userID).toBeTruthy();
      expect(body.username).toBe(username);

      userId = body.userID;
    });

    await test.step('Gerar token de autenticação', async () => {
      const response = await request.post('/Account/v1/GenerateToken', {
        data: {
          userName: username,
          password,
        },
      });

      expect(response.status()).toBe(200);

      const body = (await response.json()) as GenerateTokenResponse;

      expect(body.status).toBe('Success');
      expect(body.token).toBeTruthy();

      token = body.token;
    });

    await test.step('Consultar livros disponíveis', async () => {
      const response = await request.get('/BookStore/v1/Books');

      expect(response.status()).toBe(200);

      const body = (await response.json()) as BooksResponse;

      expect(Array.isArray(body.books)).toBe(true);
      expect(body.books.length).toBeGreaterThanOrEqual(2);

      selectedIsbns = body.books
        .slice(0, 2)
        .map((book) => book.isbn);

      expect(selectedIsbns).toHaveLength(2);
    });

    await test.step('Adicionar livros ao usuário', async () => {
      const response = await request.post('/BookStore/v1/Books', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          userId,
          collectionOfIsbns: selectedIsbns.map((isbn) => ({ isbn })),
        },
      });

      expect(response.status()).toBe(201);

      const body = (await response.json()) as AddBooksResponse;

      const returnedIsbns = body.books.map((book) => book.isbn);

      expect(returnedIsbns).toEqual(selectedIsbns);
    });

    await test.step('Validar livros associados ao usuário', async () => {
      const response = await request.get(`/Account/v1/User/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.status()).toBe(200);

      const body = (await response.json()) as UserResponse;

      expect(body.username).toBe(username);
      expect(body.books).toHaveLength(2);

      const returnedIsbns = body.books.map((book) => book.isbn);

      expect(returnedIsbns).toEqual(selectedIsbns);
    });

    await test.step('Remover usuário criado', async () => {
      const response = await request.delete(`/Account/v1/User/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.status()).toBe(204);
    });
  });
});