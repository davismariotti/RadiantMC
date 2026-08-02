package com.davismariotti.radiantmc.listeners;

import com.davismariotti.radiantmc.data.DataFile;
import com.google.inject.Inject;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerQuitEvent;

public class LogoutListener implements Listener {

    private final DataFile dataFile;

    @Inject
    public LogoutListener(DataFile dataFile) {
        this.dataFile = dataFile;
    }

    @EventHandler
    public void onQuit(PlayerQuitEvent event) {
        dataFile.setLastLoginAsNow(event.getPlayer());
    }
}
