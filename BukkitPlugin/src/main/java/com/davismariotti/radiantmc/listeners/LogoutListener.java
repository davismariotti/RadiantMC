package com.davismariotti.radiantmc.listeners;

import com.davismariotti.radiantmc.RadiantMCPlugin;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerQuitEvent;

public class LogoutListener implements Listener {

    @EventHandler
    public void onQuit(PlayerQuitEvent event) {
        Player player = event.getPlayer();

        RadiantMCPlugin.instance.getData().set(String.format("logout.%s", player.getUniqueId()), System.currentTimeMillis());
        RadiantMCPlugin.instance.saveData();
    }
}
