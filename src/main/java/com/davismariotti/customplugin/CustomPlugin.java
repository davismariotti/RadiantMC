package com.davismariotti.customplugin;

import com.davismariotti.customplugin.commands.LastLoginCommand;
import com.davismariotti.customplugin.commands.MotdCommand;
import com.davismariotti.customplugin.commands.NetherCoordsCommand;
import com.davismariotti.customplugin.commands.NickCommand;
import com.davismariotti.customplugin.commands.RemoveNickCommand;
import com.davismariotti.customplugin.listeners.DeathListener;
import com.davismariotti.customplugin.listeners.LoginListener;
import org.bukkit.event.Listener;
import org.bukkit.plugin.java.JavaPlugin;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class CustomPlugin extends JavaPlugin {

    public static CustomPlugin instance;
    private List<Listener> listeners = new ArrayList<>();

    public CustomPlugin() {
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
            File file = new File(CustomPlugin.instance.getDataFolder(), "motd.txt");
            if (!file.exists()) {
                file.createNewFile();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
