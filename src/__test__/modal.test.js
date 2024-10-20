import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import { ThemeProvider } from "../utils/context/ThemeContext";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import MOCK_DATA from "../utils/mocks/MOCK_DATA.json";
import "@testing-library/jest-dom/extend-expect";

const queryClient = new QueryClient();

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    })
  );
});

// afterEach(() => {
//   jest.restoreAllMocks();
// });

test("opens modal correctly when character card is clicked", async () => {
  render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );

  expect(await screen.findByText('All Planets')).toBeInTheDocument();


  const characterCard = screen.getByText((content, element) =>
    content.includes("Luke Skywalker")
  );

  fireEvent.click(characterCard);


  const modalTitle = await screen.findByText(/172 cm/i);
  expect(modalTitle).toBeInTheDocument();
});

