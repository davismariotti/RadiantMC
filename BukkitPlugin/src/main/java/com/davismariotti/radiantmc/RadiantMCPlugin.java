package com.davismariotti.radiantmc;

import com.davismariotti.radiantmc.commands.LastLoginCommand;
import com.davismariotti.radiantmc.commands.MotdCommand;
import com.davismariotti.radiantmc.commands.NetherCoordsCommand;
import com.davismariotti.radiantmc.commands.NickCommand;
import com.davismariotti.radiantmc.commands.RemoveNickCommand;
import com.davismariotti.radiantmc.listeners.DeathListener;
import com.davismariotti.radiantmc.listeners.LoginListener;
import org.bukkit.event.Listener;
import org.bukkit.plugin.java.JavaPlugin;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class RadiantMCPlugin extends JavaPlugin {

    public static RadiantMCPlugin instance;
    private List<Listener> listeners = new ArrayList<>();

    public RadiantMCPlugin() {
        instance = this;
        listeners.add(new LoginListener());
        listeners.add(new DeathListener());
    }

    @Override
    public void onEnable() {
        saveDefaultConfig();
        for (Listener listener : listeners) {
            getServer().getPluginManager().registerEvents(listener, this);
        }
        Objects.requireNonNull(getCommand("nick")).setExecutor(new NickCommand());
        Objects.requireNonNull(getCommand("removenick")).setExecutor(new RemoveNickCommand());
        Objects.requireNonNull(getCommand("lastlogin")).setExecutor(new LastLoginCommand());
        Objects.requireNonNull(getCommand("nethercoords")).setExecutor(new NetherCoordsCommand());
        Objects.requireNonNull(getCommand("motd")).setExecutor(new MotdCommand());

        try {
            File file = new File(RadiantMCPlugin.instance.getDataFolder(), "motd.txt");
            if (!file.exists()) {
                file.createNewFile();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
