import type HomePage from './HomePage.tsx';

interface PortfolioModule {
  default: typeof HomePage;
}

// The portfolio is fetched once: behind the enter page's glass for a visitor who
// arrives at the front door, or behind the loading page for one who lands on a
// portfolio route directly.
let portfolio: Promise<PortfolioModule> | null = null;
let ready = false;

// A photo that never arrives mustn't keep the enter page's door shut.
const WARM_MS = 5_000;

const warm = (src: string): Promise<void> => {
  const img = new Image();
  img.src = src;
  return Promise.race([
    img.decode().catch(() => undefined),
    new Promise<void>(resolve => setTimeout(resolve, WARM_MS)),
  ]);
};

/** Starts (or joins) loading the portfolio: its code and the images it opens with. */
export function loadPortfolio(): Promise<PortfolioModule> {
  portfolio ??= Promise.all([import('./HomePage.tsx'), import('../data.ts')])
    .then(async ([page, data]) => {
      await Promise.all(data.openingImages.map(warm));
      ready = true;
      return page;
    })
    .catch((error: unknown) => {
      // let a later visit try again
      portfolio = null;
      throw error;
    });
  return portfolio;
}

/** True once the portfolio has fully loaded. */
export const portfolioReady = (): boolean => ready;
