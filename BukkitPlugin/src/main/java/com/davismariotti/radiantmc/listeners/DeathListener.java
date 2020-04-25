package com.davismariotti.radiantmc.listeners;

import com.davismariotti.radiantmc.RadiantMCPlugin;
import org.bukkit.Bukkit;
import org.bukkit.Material;
import org.bukkit.World;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.entity.PlayerDeathEvent;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.SkullMeta;

public class DeathListener implements Listener {

    @EventHandler
    public void onDeath(PlayerDeathEvent event) {
        Player player = event.getEntity();

        Player killer = player.getKiller();
        if (killer != null && !player.getName().equals(killer.getName())) {
            ItemStack skull = new ItemStack(Material.PLAYER_HEAD);
            SkullMeta meta = (SkullMeta) skull.getItemMeta();
            meta.setOwningPlayer(player);
            skull.setItemMeta(meta);

            World world = player.getWorld();
            Bukkit.getScheduler().runTaskLater(RadiantMCPlugin.instance, () -> {
                world.dropItemNaturally(player.getLocation(), skull);
            }, 20L);
        }
    }
}
