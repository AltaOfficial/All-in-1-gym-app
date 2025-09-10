package com.strive.app;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.UnknownHostException;

@SpringBootApplication
public class AppApplication implements CommandLineRunner {

    @Value("${SERVER_PORT}")
    private int serverPort;

	public static void main(String[] args) {
		SpringApplication.run(AppApplication.class, args);
	}

    @Override
    public void run(String... args) throws SocketException, UnknownHostException {

        // Getting local IP programmatically so I don’t have to run ipconfig/cmd when setting .env for mobile app
        final DatagramSocket datagramSocket = new DatagramSocket();
        datagramSocket.connect(InetAddress.getByName("8.8.8.8"), 12345);
        System.out.println("ready on " + datagramSocket.getLocalAddress().getHostAddress() + ":" + serverPort);
    }
}
