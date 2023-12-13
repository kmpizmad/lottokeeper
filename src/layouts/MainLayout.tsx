import Button from '@mui/material/Button';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Player } from '../hooks/usePlayer';
import { getEntity, saveEntity } from '../lib/utils';
import { Maintainer } from '../hooks/useMaintainer';

const buttons = [
  { label: 'Játékos', activePath: '/player' },
  { label: 'Üzemeltető', activePath: '/maintainer' },
];

function MainLayout({ children }: React.PropsWithChildren<unknown>): JSX.Element | null {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen">
      <header className="p-4 bg-gray-900">
        <nav className="flex flex-row items-center justify-between gap-2">
          <div>
            {buttons.map((btn, i) => (
              <Button key={`layout-button-${btn.label}-${i}`} color="primary" variant="text">
                <Link to={btn.activePath}>{btn.label}</Link>
              </Button>
            ))}
          </div>
          <div>
            <Button
              color="secondary"
              variant="text"
              onClick={() => {
                const player = getEntity<Player>('player');
                if (player) saveEntity<Player>('player', { ...player, tickets: [] });
                const maintainer = getEntity<Maintainer>('maintainer');
                if (maintainer) saveEntity<Maintainer>('maintainer', { ...maintainer, tickets: [] });
                navigate('/');
              }}
            >
              Új kör
            </Button>
            <Button
              color="error"
              variant="text"
              onClick={() => {
                window.localStorage.removeItem('player');
                window.localStorage.removeItem('maintainer');
                navigate('/');
              }}
            >
              Visszaállítás
            </Button>
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer></footer>
    </div>
  );
}

export default MainLayout;
