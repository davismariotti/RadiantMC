package com.davismariotti.radiantmc;

import com.davismariotti.radiantmc.commands.LastLoginCommand;
import com.davismariotti.radiantmc.commands.MotdCommand;
import com.davismariotti.radiantmc.commands.NetherCoordsCommand;
import com.davismariotti.radiantmc.commands.NickCommand;
import com.davismariotti.radiantmc.data.DataFile;
import com.davismariotti.radiantmc.listeners.DeathListener;
import com.davismariotti.radiantmc.listeners.LoginListener;
import com.davismariotti.radiantmc.listeners.LogoutListener;
import com.google.inject.Inject;
import com.google.inject.Injector;
import org.bukkit.command.CommandExecutor;
import org.bukkit.event.Listener;
import org.bukkit.plugin.java.JavaPlugin;

import java.io.File;
import java.io.IOException;
import java.util.*;

public class RadiantMCPlugin extends JavaPlugin {

    @Inject
    DataFile dataFile;

    Map<String, Class<? extends CommandExecutor>> commands = new HashMap<>() {{
        put("nick", NickCommand.class);
        put("lastlogin", LastLoginCommand.class);
        put("nethercoords", NetherCoordsCommand.class);
        put("motd", MotdCommand.class);
    }};

    List<Class<? extends Listener>> listeners = new ArrayList<>() {{
        add(LoginListener.class);
        add(LogoutListener.class);
        add(DeathListener.class);
    }};

    @Override
    public void onEnable() {
        OnStartupModule module = new OnStartupModule(this);
        Injector injector = module.createInjector();
        injector.injectMembers(this);

        saveDefaultConfig();
        dataFile.loadData();

        listeners.forEach(clazz -> getServer().getPluginManager().registerEvents(injector.getInstance(clazz), this));
        commands.forEach((name, clazz) -> Objects.requireNonNull(getCommand(name)).setExecutor(injector.getInstance(clazz)));

        try {
            File file = new File(getDataFolder(), "motd.txt");
            if (!file.exists()) {
                file.createNewFile();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
