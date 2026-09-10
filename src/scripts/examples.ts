const card = document.querySelector<HTMLElement>('[data-example-card]');
if (card) {
  const choices = card.querySelectorAll<HTMLButtonElement>(
    '[data-example-choice]',
  );
  const panels = card.querySelectorAll<HTMLElement>('[data-example-panel]');
  const toggle = card.querySelector<HTMLButtonElement>('[data-result-toggle]')!;
  const caption = card.querySelector<HTMLElement>('[data-result-caption]')!;
  let decimal = false;

  function updateResult() {
    card!
      .querySelectorAll<HTMLElement>('[data-result-exact]')
      .forEach((result) => (result.hidden = decimal));
    card!
      .querySelectorAll<HTMLElement>('[data-result-decimal]')
      .forEach((result) => (result.hidden = !decimal));
    toggle.setAttribute('aria-pressed', String(decimal));
    toggle.setAttribute(
      'aria-label',
      decimal ? 'S⇔D: Show exact result' : 'S⇔D: Show decimal result',
    );
    caption.textContent = decimal ? 'Decimal form' : 'Exact answer';
  }

  choices.forEach((button) =>
    button.addEventListener('click', () => {
      choices.forEach((choice) =>
        choice.setAttribute('aria-pressed', String(choice === button)),
      );
      panels.forEach(
        (panel) =>
          (panel.hidden =
            panel.dataset.examplePanel !== button.dataset.exampleChoice),
      );
      updateResult();
    }),
  );
  toggle.addEventListener('click', () => {
    decimal = !decimal;
    updateResult();
  });
  card
    .querySelectorAll<HTMLButtonElement>('[data-theme-choice]')
    .forEach((button) =>
      button.addEventListener('click', () => {
        card.dataset.theme = button.dataset.themeChoice;
        card
          .querySelectorAll('[data-theme-choice]')
          .forEach((choice) =>
            choice.setAttribute('aria-pressed', String(choice === button)),
          );
      }),
    );
}
