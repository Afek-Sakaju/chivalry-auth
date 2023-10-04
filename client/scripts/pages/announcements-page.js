window.onload = async () => {
  const isAuthenticated = await isAuthenticatedUser();
  if (!isAuthenticated) {
    await showAlert({
      message: 'Entrance permitted only to Spartans who have been logged in.',
      alertButtonProperties: { text: 'Understood', href: '/login' },
      isAccessDeniedAlert: true,
      displayDuration: 2,
      delayDisplayDuration: 0.1,
      onClose: () => {
        window.location.href = '/login';
      },
    });

    localStorage.removeItem('jwtAccessToken');
    return updateNavbarAuthState(false);
  }

  updateNavbarAuthState(true);
  try {
    const annListContainer = document.getElementById('announcements-panel');
    if (!annListContainer) return;

    const annResponse = await getData('/announcements/all');
    if (!annResponse) throw Error('There was an issue fetching tactics data.');

    const annData = await annResponse?.json();
    annData?.forEach(({ title, description, announcer }) => {
      const annWrapper = document.createElement('div');
      annWrapper.classList.add('announcement-container');

      const annTitle = document.createElement('h3');
      annTitle.classList.add('announcement-title');
      annTitle.textContent = title;
      annWrapper.appendChild(annTitle);

      const annDescription = document.createElement('p');
      annDescription.classList.add('announcement-text');

      const replacedAnnDescription = addLineBreaksToText(description);
      annDescription.textContent = replacedAnnDescription;
      annWrapper.appendChild(annDescription);

      const annAnnouncer = document.createElement('p');
      annAnnouncer.classList.add('announcement-text', 'announcer-text');
      annAnnouncer.textContent = announcer;
      annWrapper.appendChild(annAnnouncer);

      annListContainer.appendChild(annWrapper);
      unhideElements('announcements-panel');
    });
  } catch (e) {
    const message = e?.message ?? 'Server data retrieval issue.';
    console.error(e);
    await showAlert({ message });
  }
};