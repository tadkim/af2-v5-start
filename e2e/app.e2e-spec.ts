import { Af2V5StartPage } from './app.po';

describe('af2-v5-start App', () => {
  let page: Af2V5StartPage;

  beforeEach(() => {
    page = new Af2V5StartPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
