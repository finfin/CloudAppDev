//
//  ViewController.m
//  iPhoneMogoDBLabIV
//
//  Created by En on 13/3/12.
//  Copyright (c) 2013年 En. All rights reserved.
//

#import "ViewController.h"
#import "AppDelegate.h"
@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)postAction:(id)sender
{
    dispatch_queue_t network_queue;
    network_queue = dispatch_queue_create("com.myApp.network", nil);
    dispatch_async(network_queue, ^{
        NSString *token = ((AppDelegate *)[[UIApplication sharedApplication]delegate]).token;
        NSMutableURLRequest *request = [[NSMutableURLRequest alloc]init];
//        NSURL *connect = [[NSURL alloc]initWithString:@"http://192.168.1.116:3000/iPhoneUUIDSave"];
        NSURL *connect = [[NSURL alloc]initWithString:@"http://10.10.99.103:3000/iPhoneUUIDSave"];
        NSString *httpBodyString=[NSString stringWithFormat:@"UUID=%@",token];
        [request setURL:connect];
        [request setHTTPMethod:@"POST"];
        [request setHTTPBody:[httpBodyString dataUsingEncoding:NSUTF8StringEncoding]];
        NSData *data = [NSURLConnection sendSynchronousRequest:request returningResponse:nil error:nil];
        NSString *strBack = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        dispatch_async(dispatch_get_main_queue(), ^{
            NSLog(@"strBack:%@",strBack);
        });
    });
}
@end
