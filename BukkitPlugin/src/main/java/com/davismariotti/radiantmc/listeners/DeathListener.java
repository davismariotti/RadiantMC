package com.davismariotti.radiantmc.listeners;

import com.davismariotti.radiantmc.RadiantMCPlugin;
import com.google.inject.Inject;
import lombok.RequiredArgsConstructor;
import org.bukkit.Bukkit;
import org.bukkit.Material;
import org.bukkit.World;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.entity.PlayerDeathEvent;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.SkullMeta;

@RequiredArgsConstructor(onConstructor_ = {@Inject})
public class DeathListener implements Listener {

    private final RadiantMCPlugin plugin;

    @EventHandler
    public void onDeath(PlayerDeathEvent event) {
        Player player = event.getEntity();

        Player killer = player.getKiller();
        if (killer != null && !player.getName().equals(killer.getName())) {
            ItemStack skull = new ItemStack(Material.PLAYER_HEAD);
            SkullMeta meta = (SkullMeta) skull.getItemMeta();
            if (meta != null) {
                meta.setOwningPlayer(player);
                skull.setItemMeta(meta);

                World world = player.getWorld();
                Bukkit.getScheduler().runTaskLater(plugin, () -> world.dropItemNaturally(player.getLocation(), skull), 20L);
            }
        }
    }
}
